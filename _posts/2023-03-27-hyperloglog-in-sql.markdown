---
author: Alejandro Giacometti
date: 2023-03-30 00:00:00+00:00
layout: post
title: Hyperloglog in PostgreSQL
description: Writing a Hyperloglog custom aggregate to perform fast cardinality approximations in PostgreSQL without using an extension
---

I wrote a version of HyperLogLog cardinality approximation in SQL and PL/pgSQL. It can be faster than using `COUNT(DISTINCT...)` under the right circumstances and can be used with any Postgres database – even RDS – without elevated privileges.

Yeah, yeah, yeah... This is too long, can you _[just show me the code!](#just-show-me-the-code)_
{:.side-note}

[Hyperloglog](https://en.wikipedia.org/wiki/HyperLogLog) is an algorithm for estimating the cardinality of a dataset. It is often used to answer questions such as - _How many of our users are active per day?_

It often replaces queries like this:

```sql
select
    created_on as created_on,
    COUNT(distinct user_id) as n_active_sessions
from user_session
group by created_on
```

The problem with this query is that the database needs to keep a record of every unique user id in the dataset for every day in question before counting them. Imagine running this over a few hundred thousand users for a few weeks. Very quickly you are talking about millions of records.

Next, you might want to ask a slightly different, but related question – _How many of our users visit one of our ten top features per day?_

You can see how the related records that we must keep track of can quickly grow out of hand. The answers to those questions will become harder to find and slower to calculate.

Hyperloglog is a way of answering these questions with an estimate, without having to keep track of all these records.

The Hyperloglog algorithm works based on the observation that in a uniformly distributed sequence of binary numbers, a maximum sequence of $n$ zeroes estimates the cardinality of the sequence to be $2^n$. This is great. It means that to estimate how many unique users are active on our platform on any given day, we only need to find the user id with the longest sequence of zeroes as a prefix. Interestingly, to compute it, we only need to keep track of one number: the longest observed sequence of zeroes.

One issue with this estimate is that it suffers from high variance due to outliers. An improved estimate can be obtained by dividing the sequence into buckets based on a prefix of the numbers in the sequence and keeping track of the maximum sequence of zeroes observed for each bucket. The sequence for each bucket can be used to produce an estimate and those estimates can be averaged for a final improved approximation of the real count.

The Hyperloglog algorithm includes a few more steps – it uses a series of clever tricks to make the estimate more accurate. To understand it in detail, read the [original paper](http://algo.inria.fr/flajolet/Publications/FlMa85.pdf), the [Wikipedia article](https://en.wikipedia.org/wiki/Hyperloglog), or [other](https://stackoverflow.com/questions/12327004/how-does-the-Hyperloglog-algorithm-work)
very accessible [explanation](https://towardsdatascience.com/hyperloglog-a-simple-but-powerful-algorithm-for-data-scientists-aed50fe47869)s elsewhere.

Many analytics platforms make use of the Hyperloglog algorithm internally (or an improved Hyperloglog++). It is natively supported by [Elasticsearch](https://engineering.fb.com/2018/12/13/data-infrastructure/hyperloglog/), [Redis](https://redis.io/docs/data-types/hyperloglogs/), [Presto](https://engineering.fb.com/2018/12/13/data-infrastructure/hyperloglog/), [BigQuery](https://cloud.google.com/bigquery/docs/reference/standard-sql/hll_functions) & [Snowflake](https://docs.snowflake.com/en/user-guide/querying-approximate-cardinality). [Postgres-hll][postgres-hll] from [citusdata](https://www.citusdata.com/blog/2017/06/30/efficient-rollup-with-hyperloglog-on-postgres/) is an extension to Postgres that can compute the estimate. Unfortunately, it is not included in the list of amazon [RDS trusted extensions](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html#PostgreSQL.Concepts.General.Extensions.Trusted).

[postgres-hll]: https://github.com/citusdata/postgresql-hll

It looks like if we want to use Hyperloglog in RDS our only option is to write a version of the algorithm in pure SQL. Fortunately, the internet delivers, and there have been a [few](https://www.sisense.com/blog/hyperloglog-in-pure-sql/) [attempts](https://towardsdatascience.com/hyperloglog-implemented-using-sql-d516fc4828ce) at doing this as well. There is even an attempt to write an extension to the [Django ORM](https://www.agiliq.com/blog/2017/12/adventures-in-advanced-django-orm-with-hyperloglog/).

These previous implementations are great! They do what we want them to do and reading the SQL queries is straightforward. However, they are all quite a mouthful. I would love to be able to use them in a lot of different places, but copy-pasting any of them many times makes me very nervous. Wouldn't it be nice if we could write a query like this:

```sql
select
    created_on as created_on,
    approx_distinct_count(user_id) as n_approx_active_sessions
from user_session
group by created_on
```

Can we turn these SQL implementations of Hyperloglog into a custom Postgres function? Let's give it a try!

## Inside Postgres

The Postgres documentation is terse, and I am a beginner – the first thing I found out is that we need to create a [custom aggregate](https://www.postgresql.org/docs/current/sql-createaggregate.html). There are two parts to an aggregate an `sfunc` and a `finalfunc`

An `sfunc` is a state transition function that takes the saved state and consumes a new input row. It then outputs a transformed state, ready for the next input.

A `finalfunc` takes the final state and makes any necessary calculations to produce the desired aggregate.

So, we can split our Hyperloglog algorithm into two parts:

1. a bucketing function that hashes each input and saves the state of the current buckets and the maximum observed sequence of zeros for each bucket. and
2. a function that uses the buckets once we have consumed every row and calculates the cardinality estimate.

We can start by creating a type to represent our state:

```sql
create type
bucketed_result
as (bucket_num integer, bucket_hash integer);
```

The state will consist of an array of (at most) 512 `bucket_num`,`bucket_hash` pairs. `bucket_num` is our bucket prefix and `bucket_hash` holds the maximum observed sequence of zeroes for that bucket.

We can then write the `sfunc` bucketing function:

```sql
create or replace function
bucket(agg_state bucketed_result[], input varchar)
returns bucketed_result[]
language sql immutable strict parallel safe as
$$
with current_input_bucket as (
    select
        HASHTEXT(input) & (512 - 1) as bucket_num,
        31 - FLOOR(LOG(2, HASHTEXT(input) & 2147483647::integer)) as bucket_hash
)

select array(
    select
        (
            COALESCE(current_input_bucket.bucket_num, agg_state_table.bucket_num),
            GREATEST(current_input_bucket.bucket_hash, agg_state_table.bucket_hash)
        )::bucketed_result
    from
        current_input_bucket
    full outer join
        UNNEST(agg_state) as agg_state_table
        on agg_state_table.bucket_num = current_input_bucket.bucket_num
)
$$;
```

There are two parts to this: first we calculate the bucket number and significant digit sequence for the current row, and then we join that with our current state. We use a full outer join on the bucket number to keep every previously observed bucket and any new bucket.

We use the `UNNEST` function to unpack the array into a table. And we then pack the new state back into an array of `bucketed_result`s. The function returns the result of the last query.

We then need a method for using the `bucketed_result[]` state and to calculate the final Hyperloglog approximation:

```sql
create or replace function
hll(agg_state bucketed_result[])
returns numeric
language sql immutable as
$$
with counted_data as (
    select
        (
            (
                POW(512, 2) * (0.7213 / (1 + 1.079 / 512))
            ) / (
                (512 - COUNT(agg_state_table.bucket_num))
                + SUM(POW(2, -1 * agg_state_table.bucket_hash))
            )
        )::integer as num_uniques,
        512 - COUNT(agg_state_table.bucket_num) as num_zero_buckets
    from UNNEST(agg_state) as agg_state_table
)
select
    case
        when counted_data.num_uniques < 2.5 * 512
            and counted_data.num_zero_buckets > 0 then (
                (0.7213 / (1 + 1.079 / 512))
                * (512 * LOG(2, (512::numeric) / counted_data.num_zero_buckets))
            )::int
        else counted_data.num_uniques
    end as approx_distinct_count
from counted_data
$$;
```

This is where clever math tricks happen to arrive at an accurate approximation. For our purposes, the important bits are that this function takes our state array of type `bucketed_result[]` and produces a `numeric` approximation.

We can now put the two pieces together and create a custom aggregate:

```sql
create or replace aggregate
approx_distinct_count(varchar) (
    SFUNC = bucket,
    STYPE = bucketed_result[],
    FINALFUNC = hll,
    INITCOND = '{}',
    PARALLEL = safe
);
```

That's it! We'll need to cast the `user_id` to `varchar` because that's the only type that our custom aggregation takes, but it should produce accurate estimates. We can now call our new aggregate:

```sql
select
    created_on as created_on,
    approx_distinct_count(user_id::varchar) as n_approx_active_sessions
from user_session
group by created_on;
```

## Test data

Let's create a simple synthetic dataset to test the aggregation:

```sql
drop table if exists user_session;
create table user_session (
    user_id varchar not null,
    created_on date
);

insert into user_session (user_id, created_on)
select
    SUBSTR(MD5(RANDOM()::text), 1, 8) as user_id,
    (date '2023-01-02' + (RANDOM() * 4)::integer) as created_on
from GENERATE_SERIES(1, 1000000)
union
select
    SUBSTR(MD5(RANDOM()::text), 1, 8) as user_id,
    (date '2023-01-07' + (RANDOM() * 1)::integer) as created_on
from GENERATE_SERIES(1, 25000);
```

This should insert a million random user sessions for 5 days after Monday, Jan 2nd and twenty-five thousand sessions on the weekend. Let's first check that our approximations are accurate:

```sql
select
    created_on as created_on,
    COUNT(distinct user_id) as n_active_sessions,
    approx_distinct_count(user_id::varchar) as n_approx_active_sessions
from user_session
group by created_on;
 created_on | n_active_sessions | n_approx_active_sessions
------------+-------------------+--------------------------
 2023-01-02 |            125438 |                   124336
 2023-01-03 |            249017 |                   225077
 2023-01-04 |            250564 |                   233943
 2023-01-05 |            250028 |                   251278
 2023-01-06 |            124927 |                   138046
 2023-01-07 |             12436 |                    13204
 2023-01-08 |             12564 |                    11179
(7 rows)
```

Hey, that's quite good! The numbers are not exact, but they are pretty close. Certainly close enough for a lot of use cases.

## But, is it fast?

Sadly, no. Let's start with count distinct alone:

```sql
select
    created_on as created_on,
    COUNT(distinct user_id) as n_active_sessions
from user_session
group by created_on;
 created_on | n_active_sessions
------------+-------------------
 2023-01-02 |            125438
 2023-01-03 |            249017
 2023-01-04 |            250564
 2023-01-05 |            250028
 2023-01-06 |            124927
 2023-01-07 |             12436
 2023-01-08 |             12564
(7 rows)

Time: 2253.115 ms (00:02.253)
```

A couple of seconds is going to be hard to beat. Our approximation takes significantly longer:

```sql
select
    created_on as created_on,
    approx_distinct_count(user_id::varchar) as n_approx_active_sessions
from user_session
group by created_on;
 created_on | n_approx_active_sessions
------------+--------------------------
 2023-01-03 |                   225077
 2023-01-02 |                   124336
 2023-01-06 |                   138046
 2023-01-04 |                   233943
 2023-01-07 |                    13204
 2023-01-08 |                    11179
 2023-01-05 |                   251278
(7 rows)

Time: 120344.232 ms (02:00.344)
```

Uff! That is painful to see. It's two orders of magnitude slower. It will be pretty hard to make an argument to use a function that produces approximations slower than you can calculate the real figures.

## Can we speed it up?

The first thing to notice is that the bucketing function needs to be applied sequentially to every row in our dataset. This means we cannot take advantage of parallelism. Fortunately, we can add another function called a `combinefunc` to our aggregate to enable parallel execution.

A `combinefunc` takes two distinct states, potentially produced by consuming independent sections of the sequence, and combines them into a single state. This enables Postgres to divide the sequence into any number of sections and to process each row in those sections concurrently. It then combine the results before calculating the final approximation.

```sql
create or replace function
bucket_combine(left_state bucketed_result[], right_state bucketed_result[])
returns bucketed_result[]
language sql immutable strict parallel safe as
$$
select array(
    select
        (
            COALESCE(left_state_table.bucket_num, right_state_table.bucket_num),
            GREATEST(left_state_table.bucket_hash, right_state_table.bucket_hash)
        )::bucketed_result
    from
        UNNEST(left_state) as left_state_table
    full outer join
        UNNEST(right_state) as right_state_table
        on left_state_table.bucket_num = right_state_table.bucket_num
)
$$;
```

Similar to the bucketing function, we unnest each state and perform a full outer join. This time, however, we ensure that we keep any `bucket_num` in either the left or the right state alongside the longest observed `bucket_hash` for each bucket.

We can add it to the aggregate with:

```sql
create or replace aggregate
approx_distinct_count(varchar) (
    SFUNC = bucket,
    STYPE = bucketed_result[],
    FINALFUNC = hll,
    COMBINEFUNC = bucket_combine,
    INITCOND = '{}',
    PARALLEL = safe
);
```

Even if the method is not very fast, this should perform faster because Postgres can make use of more than one core of the machine at a time. So, how much does this speed our query up?

```sql
select
    created_on as created_on,
    approx_distinct_count(user_id::varchar) as n_approx_active_sessions
from user_session
group by created_on;
 created_on | n_approx_active_sessions
------------+--------------------------
 2023-01-02 |                   124336
 2023-01-03 |                   225077
 2023-01-04 |                   233943
 2023-01-05 |                   251278
 2023-01-06 |                   138046
 2023-01-07 |                    13204
 2023-01-08 |                    11179
(7 rows)

Time: 42966.308 ms (00:42.966)
```

Well, we have gone from a horrific 120 seconds to 40, which is an improvement. The truth is, however, we are far from the promise of a fast approximation.

At this stage, I was a little puzzled. Still, I thought – the bucketing functions rely on full outer joins. We are horizontally joining the two states. This might be making things slow, so I tried replacing them with union queries:

```sql
create or replace function
bucket(agg_state bucketed_result[], input varchar)
returns bucketed_result[]
language sql immutable strict parallel safe as
$$
select array(
    select (bucket_num, max(bucket_hash))::bucketed_result
    from (
        (
            select *
            from UNNEST(agg_state) as agg_state_table
        )
        union all
        (
            select
                HASHTEXT(input)::bigint & (512 - 1) as bucket_num,
                31 - floor(
                    log(2, HASHTEXT(input) & 2147483647::bigint)
                ) as bucket_hash
        )
    ) as combined_state
    group by bucket_num
)
$$;
```

And something similar for the `bucket_combine` function. But this performed even worse:

```sql
select
    created_on as created_on,
    approx_distinct_count(user_id::varchar) as n_approx_active_sessions
from user_session
group by created_on;
 created_on | n_approx_active_sessions
------------+--------------------------
 2023-01-02 |                   124336
 2023-01-03 |                   225077
 2023-01-04 |                   233943
 2023-01-05 |                   251278
 2023-01-06 |                   138046
 2023-01-07 |                    13204
 2023-01-08 |                    11179
(7 rows)

Time: 77973.929 ms (01:17.974)
```

Pretty disappointing. We've gone back to almost 2 minutes.

## State management

My colleague [Elliott](https://github.com/elliott-omosheye) was also interested in this problem, so he started doing some experiments himself. His approach performed better and included some interesting observations:

1. The aggregation state looks like a hash table. Postgres has native support for JSON types – Elliott used a JSON dictionary to keep track of the state rather than an array of a custom type.

2. The bucket function is doing some computation to extract the most significant bit from the hash. Elliott noticed that we are only interested in finding the smallest hash in a bucket. We can delay that computation to the end and it only needs to happen on the 512 bucketed hashes rather than every single record.

3. I had assumed that writing native SQL was going to get us to the fastest solution because we can rely on Postgres to run any optimisations to the queries. Elliott, however, used [PL/pgSQL](https://www.postgresql.org/docs/current/plpgsql-overview.html#PLPGSQL-ADVANTAGES) to manipulate JSON, and it did pretty well. It looks like, in this particular case, avoiding a join for every iteration might yield a faster result – even if we are using a procedural language.

We started talking about the problem and decided to incorporate those ideas with a couple of modifications:

1. We don't need to use JSON. The state array is indexed on 512 numbers, so we only really need to keep the hash and the index of that hash.

2. We can directly modify the state instead of recreating it in every iteration. I noticed the following quote in the `create aggregate` documentation:

   > Ordinarily, PostgreSQL functions are expected to be true functions that do not modify their input values. However, an aggregate transition function, when used in the context of an aggregate, is allowed to cheat and modify its transition-state argument in place. This can provide substantial performance benefits compared to making a fresh copy of the transition state each time.
   >
   > -- [CREATE AGGREGATE > Notes](https://www.postgresql.org/docs/current/sql-createaggregate.html)

## Moving away from SQL

We can improve the performance - let's start with the bucket function:

```sql
create or replace function
bucket(agg_state integer[512], input varchar)
returns integer[512]
language plpgsql immutable strict parallel safe as
$$
declare
    hashed_input integer := HASHTEXT(input);
    bucket_key integer := hashed_input & (512 - 1);
    bucket_hash integer := hashed_input & 2147483647;
    current_hash integer := agg_state[bucket_key];
begin
    if current_hash is null or current_hash > bucket_hash then
        agg_state[bucket_key] := bucket_hash;
    end if;
    return agg_state;
end
$$;
```

This is an entirely different language, but it is pretty straightforward. We hash the input once and find the bit sequence we want to keep and the `bucket_key` index. We also preemptively retrieve the current hash for that index to compare it to the one produced by the current input.

Next, we replace the hash if the new one is smaller in the existing state object. Either way, we return the existing state.

Next, for `bucket_combine` we need to join together two integer array states:

```sql
create or replace function
bucket_combine(left_state integer[512], right_state integer[512])
returns integer[512]
language sql immutable strict parallel safe as
$$
select array(
    select
        LEAST(left_state_table.bucket_hash, right_state_table.bucket_hash)
    from
        UNNEST(left_state) with ordinality as left_state_table(bucket_hash, bucket_num)
    full outer join
        UNNEST(right_state) with ordinality as right_state_table(bucket_hash, bucket_num)
    on left_state_table.bucket_num = right_state_table.bucket_num
)
$$;
```

A useful trick used in this function is that the `UNNEST` function can natively expose the indices of an array, using `with ordinality` – similar to an `enumerate` function in python. This allows the combination of the right and left states to happen on the index of each array. The join also magically keeps track of those indices when rebuilding the array, even though it is not present in the select clause.

Next, we incorporate the significant bit computation on the `hll` function:

```sql
create or replace function
hll(agg_state integer[])
returns numeric
language sql immutable as
$$
with counted_data as (
    select
        (
            (
                POW(512, 2) * (0.7213 / (1 + 1.079 / 512))
            ) / (
                (512 - COUNT(val))
                + SUM(POW(2, -1 * (31 - FLOOR(LOG(2, val)))))
            )
        )::int as num_uniques,
        512 - COUNT(val) as num_zero_buckets
    from UNNEST(agg_state) as agg_stage_table(val)
)
select
    case
        when counted_data.num_uniques < 2.5 * 512
            and counted_data.num_zero_buckets > 0 then (
                (0.7213 / (1 + 1.079 / 512))
                * (512 * LOG(2, (512::numeric) / counted_data.num_zero_buckets))
            )::int
        else counted_data.num_uniques
    end as approx_distinct_count
from counted_data
$$;
```

Notice that these two functions now take an integer array rather than an array of `bucketed_result[]`. Finally, we declare the custom aggregation with our modified functions:

```sql
create or replace aggregate
approx_distinct_count(varchar) (
    SFUNC = bucket,
    STYPE = integer[],
    FINALFUNC = hll,
    COMBINEFUNC = bucket_combine,
    INITCOND = '{}',
    PARALLEL = safe
);
```

## Results

We started with a query that counted every distinct value per day in our synthetic dataset, which took a couple of seconds:

```sql
select
    created_on as created_on,
    count(distinct user_id) as n_active_sessions
from user_session
group by created_on;
 created_on | n_active_sessions
------------+-------------------
 2023-01-02 |            125438
 2023-01-03 |            249017
 2023-01-04 |            250564
 2023-01-05 |            250028
 2023-01-06 |            124927
 2023-01-07 |             12436
 2023-01-08 |             12564
(7 rows)

Time: 2253.115 ms (00:02.253)
```

Let's see how our improved approximation query did:

```sql
select
    created_on as created_on,
    approx_distinct_count(user_id::varchar) as n_approx_active_sessions
from user_session
group by created_on;
 created_on | n_approx_active_sessions
------------+--------------------------
 2023-01-02 |                   124336
 2023-01-03 |                   225077
 2023-01-04 |                   233943
 2023-01-05 |                   251278
 2023-01-06 |                   138046
 2023-01-07 |                    13204
 2023-01-08 |                    11179
(7 rows)

Time: 822.028 ms
```

Amazing! Less than a second!

Our approximations run faster than counting the distinct values. It is written in SQL + PL/pgSQL, so it can be added to any Postgres database, even without administrative privileges.

It is also worth considering that our synthetic data is a bit contrived – there are no other columns or tables, there is nothing else in the database, we are counting every single row, and the database is doing nothing else.

Hyperloglog is good not just because it is fast, but because it uses a tiny amount of memory. In our final implementation, the state is just an array of 512 integers. However, the performance will very much depend on the type and amount of data that you need to count. I expect that the native `COUNT(DISTINCT ...)` is well-optimised and will perform better even for medium-sized datasets.

I have not tested [postgres-hll], however, I suspect that it will significantly outperform this implementation. This version does run on RDS though!

### Just show me the code

The snippet below defines a Postgres custom aggregate `approx_distinct_count(...)` that can be used whenever you might use `COUNT(DISTINCT ...)`.

```sql
create or replace function
bucket(agg_state integer[512], input varchar)
returns integer[512]
language plpgsql immutable strict parallel safe as
$$
declare
    hashed_input integer := HASHTEXT(input);
    bucket_hash integer := hashed_input & 2147483647;
    bucket_key integer := hashed_input & (512 - 1);
    current_hash integer := agg_state[bucket_key];
begin
    if current_hash is null or current_hash > bucket_hash then
        agg_state[bucket_key] := bucket_hash;
    end if;
    return agg_state;
end
$$;

create or replace function
bucket_combine(left_state integer[512], right_state integer[512])
returns integer[512]
language sql immutable strict parallel safe as
$$
select array(
    select
        LEAST(left_state_table.bucket_hash, right_state_table.bucket_hash)
    from
        unnest(left_state) with ordinality as left_state_table(bucket_hash, bucket_num)
    full outer join
        unnest(right_state) with ordinality as right_state_table(bucket_hash, bucket_num)
    on left_state_table.bucket_num = right_state_table.bucket_num
)
$$;

create or replace function
hll(agg_state integer[])
returns numeric
language sql immutable as
$$
with counted_data as (
    select
        (
            (
                POW(512, 2) * (0.7213 / (1 + 1.079 / 512))
            ) / (
                (512 - COUNT(val)) + SUM(POW(2, -1 * (31 - floor(log(2, val)))))
            )
        )::int as num_uniques,
        512 - COUNT(val) as num_zero_buckets
    from unnest(agg_state) as agg_stage_table(val)
)
select
    case
        when counted_data.num_uniques < 2.5 * 512
            and counted_data.num_zero_buckets > 0 then (
                (0.7213 / (1 + 1.079 / 512))
                * (512 * LOG(2, (512::numeric) / counted_data.num_zero_buckets))
            )::int
        else counted_data.num_uniques
    end as approx_distinct_count
from counted_data
$$;

create or replace aggregate
approx_distinct_count(varchar) (
    SFUNC = bucket,
    STYPE = integer[],
    FINALFUNC = hll,
    COMBINEFUNC = bucket_combine,
    INITCOND = '{}',
    PARALLEL = safe
);
```
