---
author: Alejandro Giacometti
date: 2015-03-17 13:13:13+00:00
layout: post
title: What the Hashtag!?
description: I have spent the last two months in New York City as a fellow at Insight Data Science. During the programme I built brand media monitoring tool called **What the Hashtag!?**

---

*A <del>[review][]</del> of how the application works and what problem it is intended to solve, details about the methodology that I used, a description of the technology stack, and a discussion on validating the model is available <del>[here][review]</del>*. **UPDATE:** I have retired the old site and added the full review here.
{:.side-note}

I have spent the last two months in New York City as a fellow at [Insight Data Science]. It has been an exciting time. I've met some extremely intelligent people and got to meet and talk to people solving problems with data in very diverse environments. During the programme I built brand media monitoring tool called **[What the Hashtag!?][wth]**.

## Summary

**What the Hashtag!?** organises popular online written material associated with a brand to help digital media professionals explore how the public views a brand: How the public identifies the brand and what narratives are being built around it at any given time. It uses linked tweets to gather articles and judge popularity as well as topic modelling to categorize the material.

For a period of two weeks, I collected tweets and linked online articles associated with four brands: *Google*, *Facebook*, *Apple*, and *Uber*. I used topic modelling and other natural language processing methods to analyse the content of the articles in order to categorise them into distinct topics. The app presents articles ranked by popularity and topic relevance, thus allowing a digital media professional to quickly understand the diverse ways in which a brand is being discussed online.

*Below is a review of how the application works and what problem it is intended to solve, details about the methodology that I used, a description of the technology stack, and a discussion on validating the model.*

## A brand media monitor

>The only worse thing than being talked about is not being talked about  
><footer>Oscar Wilde, <cite title="The Picture of Dorian Gray">The Picture of Dorian Gray</cite></footer>

Digital journalism, citizen reporting, online reviews, and social media have multiplied, resulting in a massive expansion of the necessary effort that companies must make in order to monitor how the public feels about their brand. Monitoring the web for new stories has become a complex task, which often involves an army of digital media professionals constantly checking google alerts, twitter trends and a seemingly endless list of new channels into which *netizens* migrate periodically. The amount of content is immense, enough to make anyone want to breakdown and cry, then crawl into a corner shivering uncontrollably.

<div class="embed embed-4by3">
  <iframe class="embed-responsive-item" src="//giphy.com/embed/11ms6vNvALKmic?html5=true"></iframe>
</div>

A digital media professional overwhelmed with his daily reading material.
{:.caption}


Like most people, I now consume most of my media online. I read a few newspapers daily, follow a not-so-small number of RSS feeds on [feedly], visit [hacker news] and [reddit] on a regular basis, and my [facebook] and [twitter] feeds provide me with an endless stream of articles about interesting subjects.

However, not all media consumption is created equal. As much as the web has opened up a world of new and good writing, it has also resulted in perpetual data that needs to be monitored. This is a critical issue for digital media professionals. And so perhaps the prospect of a computer assisted practice to monitor that media is a happy one. Algorithms have been getting better at processing text for a while; we have developed automatic mechanisms for — among other things — classification, summarisation, machine translation, entity recognition and sentiment analysis.

Yet I had another concern: I *like* reading. I don't want to read an algorithmically summarised version of a story and I doubt that that experience would satisfy me in the same way my current practice of just reading what I can does. In the same vein, a digital media professional will probably want to understand the nuances and details of the story with which they are engaging. I want — and I suggest the digital media person wants as well — an aid. We need a method to choose the stories that we read in depth. So I set out to use data science as a way to assist the organisation of all this information in a way so that the user can make the decision of what to consume.

So, during the three weeks of the Insight Fellowship I built **What the Hashtag!?**. It is partly public service to salvage the mental health of a generation of social media professionals, and partly a way to explore the kinds of problems that I'd like to tackle using data science. I set out to build this project with a specific use case in mind: the inundated digital media professional. Perhaps providing some order to the information will allow them to handle it in a better, more efficient manner. **What the Hashtag!?** is a prototype for a web application that organises popular online written material associated with a brand to help digital media professionals explore how the public views a brand: How the public identifies the brand and what are the narratives that are being built around it in a particular point in time. It uses linked tweets to gather articles and judge popularity and topic modelling to categorize the material.

The problem of monitoring the media for written material associated with a particular brand is twofold: First, to ascertain which of the messages that originate from the brand — in the form of public campaigns, interviews or whitepapers — are reaching the public. Second, to identify organic stories associated with a brand. These might come in the form of bad customer service or local scandals, but they might also be random human interest stories, successful business practices or local heroes.

## Articles and popularity via social media

Social media can be a great resource in this regard. Through twitter, the public is expressly declaring the stories that they care about; they are linking to all kinds of written material, including news articles, blogposts, wikipages which they have found interesting. When that content is associated with a brand, social media users also provide the metadata: they either hashtag the brand, or they mention it in the tweet. This information is public and available in a structured format.

Over a period of two weeks, during the [Insight Data science] program I collected tweets which contain a link and are associated with the *Google*, *Facebook*, *Apple*, and *Uber* brands. These brands represent popular technology companies which have established (or reestablished) themselves in the internet generation. Intuition and would suggest that these brands will be popular in social media, social media uses will not only care about the companies and what they are doing, but should also be interested in what other people think about them.

Indeed, the data shows a curious phenomenon — there is a large number of tweets with a link  associated with a brand — 350,000 tweets tagged with Google, for example. But there is a much smaller number of unique URLs, indicating that there is a relatively small number of stories that most social media users are linking to. There is still an incredible amount of content to go through, approximately 3,000 URLs. But this number looks a lot less scary than the number of tweets.

![**Upper**: Tweets which contain a link and are associated with the Google, Facebook, Apple, and Uber brands. **Lower**: Unique URLs linked to in those tweets. Data collected for two weeks.][tweets_per_brand]

**Upper**: Tweets which contain a link and are associated with the Google, Facebook, Apple, and Uber brands. **Lower**: Unique URLs linked to in those tweets. Data collected for two weeks.
{: .caption .side-note}

More interestingly, there seems to be a few unique URLs which dominate in popularity, tens of thousands of tweets are linking to those stories. That is a clue that these stories must be important (but not necessarily, I'll get into that later). There are also a large number of URLs which have been linked by a relatively low number of tweets. Many more articles have been tweeted by a single person than those that have been tweeted repeatedly.

Frequency of tweets per unique URL. There is a few URLs that have been linked to in many tweets. Conversely, there are many URLs that have been linked by very few tweets.
{: .caption .side-note}

![Frequency of tweets per unique URL. There is a few URLs that have been linked to in many tweets. Conversely, there are many URLs that have been linked by very few tweets.][tweets_histogram]


An acceptable strategy would be to assume that the most popular URLs — those that have been linked many thousands of times — are the ones that we should care about. That would certainly reduce the workload of the digital media agent. They could choose a number: say 50, and read only those stories. The agent can then decide what steps to take to take charge of the publicity. If the story is positive, an agent can re-tweet a story to promote it. If the story is irrelevant, or if the company does not wish to give it an undue boost in popularity via the [Streisand Effect][], it is perhaps better ignored. If it is especially contentious, the agent could react in a more proactive way: initiating a campaign to end a particular bad practice, apologise, or even initiate a legal process if the story is libellous.

Looking at the most popular stories is a good strategy. However, while these stories are certainly important, it would be foolish to think that those are the only ones that matter. Stories, are not often represented by a single URL. Many journalists might be writing about a single phenomenon, perhaps coming from different perspectives. Maybe the story has been developing for some time, and there are multiple sources to be read. In these cases, there is probably no single link which is extremely popular, but a series of articles that are talking about a similar subject that all make up a developing media narrative.

In those cases we want a way to analyse the content of those stories to ascertain what the internet is talking about in general about a brand, and which of those stories is the public paying attention to. With **What the Hashtag!?**, I aim to address these issues.

## The App

The data in **What the Hashtag!?** is textual content shared in social media over a period of two weeks. The application presents these stories in two ways: First, it offers the most popular stories by number of tweets, and second, it divides the stories into topics, ranks them both by relevance and popularity and presents them back to the reader, such that they can choose what steps to take in order to protect the value of the brand.

![The application has been tracking four brands, Google, Facebook, Apple, and Uber. In the future, more could be tracked. I've added the names of twenty very valuable brands as an example.][tagcloud]
The application has been tracking four brands, Google, Facebook, Apple, and Uber. In the future, more could be tracked. I've added the names of twenty very valuable brands as an example.
{:.caption .framed}

We [begin](/) by looking at the brands that the app is tracking. The size of the brand in the tagcloud is related to the amount of unique textual content found in the dataset for the specific brand. This is not particularly important, but it is an interesting way of displaying the brands that are being tracked.

<figure class="framed wide" markdown="1">

![][uber_col1]
{:.col-xs-4 }

![][uber_col2]
{:.col-xs-4 }

![][uber_col3]
{:.col-xs-4 }

When we click into a brand — in this case uber — we are presented with a page with a listing of the stories associated with the brand through popular tweets. The stories are organised at the top by popularity, and by topic from then on.
{:.caption}

</figure>

Clicking on the name of a brand, for example, [uber](/hashtags/uber), takes us to a page which organises the URLs associated with that brand. Here, there are two layers of information, first, the three most popular stories are listed. These stories have been exclusively selected by the number of tweets that they appear in.

![Listing of the three most popular stories by number of tweets associated with uber.][uber_popular]
Listing of the three most popular stories by number of tweets associated with uber.
{:.caption .framed}

The first story is a very popular campaign by uber to deliver puppies on demand. The second is a story about conflicts between uber drivers and London's black cab drivers, a notoriously protected trade. The third story is about two competitors to uber which are joining forces to be able to compete. These are the articles which have been tweeted a lot, and are probably worth looking at.

Scrolling down we find another set of stories. The app has grouped these stories into a topic, the first of six. These stories are listed in a similar fashion to the popular ones, but are enclosed in an orange box to identify them as related.

![First group of articles associated with uber.][uber_topic1]
First group of articles associated with uber.
{:.caption .framed}

These stories seem to be about news centred around the business of uber. In this topic the app lists articles about the business practices of uber and its competitors, including two of the popular stories listed earlier. There is also a story about the organisation Mothers against drunk driving (MADD). Digging a little deeper shows that the article is about a joint effort between uber and MADD to reduce drunk driving.

![Second group of articles associated with uber.][uber_topic2]
Second group of articles associated with uber.
{:.caption .framed}

Just below, enclosed in an aqua box, we find the second group of articles. These articles look very different from the first ones. There are a few stories about a campaign where uber teamed up with animal planet's [puppy bowl] to bring puppies into offices around a few cities. There is also a story which appears to be spam, and another story about uber's business in Indonesia. These don't seem to be relevant to the topic.

![Third group of articles associated with uber.][uber_topic3]
Third group of articles associated with uber.
{:.caption .framed}

The third group of articles, in yellow, are about uber's business in new markets, mostly featuring India, stories about uber's clashes with local regulations and insurance. There are a few stories about a conflict between uber the company, uber's drivers and the registration of cars as commercial vehicles.

As we scroll down the next topics, the common themes seem to be surge pricing — a practice which allows uber to increase prices when demand is high — articles about uber in the German media, and articles about uber in media in Spanish. As we go further into the topics, they seem to lose some cohesion.

![Number of articles about uber per topic][uber_topic_plot]
Number of articles about uber per topic
{:.caption .framed}

Just before the topic boxes, the app shows a plot of the number of popular articles per topic, colour coded along with the corresponding topic boxes. This is a way to indicate how many stories are placed in each topic. The size of the topics is used to determine topic relevance. And the stories in each topic are ranked by a mixed measure of popularity vis-à-vis the other articles in the same topic, and the relevance of each article to the topic.

Our user, the digital media agent in charge of supervising the activity of the uber brand online, would then be able to react to the articles presented by our app. The articles about the puppies are topical and positive, so the digital media agent could promote them. A *promote this* button is provided so that, with a single click, the agent is redirected to a pre-filled tweet, with the URL and the brand's hashtag, ready for a comment of support. A more difficult problem is what to do with the negative stories. This application does not offer advice on how to deal with those, it only provides the awareness that they exist.

## What's behind the curtain

The application consists of a pipeline to collect and store the data, a set of processes to clean and prepare the corpus, a topic modelling algorithm, and a front end to present the results of the analysis. The application is built using a series of technologies which fit together to shape each of these modules.

### Pipeline

The data for the application comes from two locations. Tweets are first collected via the [Twitter API] using a great Python package called [Twython]. A search is performed every 10 seconds to collect tweets which are associated with a brand and filtered by ones which contain a URL. The tweets are stored in a [MongoDB] document store. Unique ID's for each tweet are stored in a special index so that no duplicate tweets are stored.

A second pipeline collects the URL entities from each tweet and stores them in a second collection where, again, no duplicate URL's are kept but a count of the number of tweets per URL is tallied. URLs are then used to scrape articles in those webpages. The great [python-goose] library is used to determine the appropriate content to keep from each article so that only the article body and title are kept, and any extraneous content — including navigation, advertising, footers — is discarded. This algorithm works by using a set of pre-defined rules and frequency measures to accurately determine which  content belongs in the body of the article.

This pipeline was built using [celery] tasks with a [redis] backend for message passing. The tasks are performed asynchronously in the background so that no single part of the process blocks any other from operating.

### Cleaning and preparation

The second step of the process is to prepare and clean the data. There are a lot of links that point to pictures, videos, apps, etc. Only textual articles are considered, so the first step is to select the articles above a threshold of 800 characters. Various values for this threshold were manually tried before this number was selected. This value seemed to discard many image only posts, without getting rid of too many short articles. This is an area where a more sophisticated method could be attempted, but this simple threshold works well for the current purpose of this project.

Each article is then converted into a vector of tokens and frequencies using the [Natural Language Processing Toolkit][nltk] (nltk) regular expression tokenizer. This process takes the text of each article and divides it into a bag-of-words, which means that only the presence and frequency of a word is considered, but not its position in the article. I also add combinations of words which appear next to each other to the vector, these are known as bi-grams. The language of the article is determined using counts of common words, known as stop words, using lists from the [nltk] stopword corpus. Stop words are then removed from the article vectors.

Finally, a vocabulary is built by collecting all of the tokens which appear in every document in the corpus. This vocabulary represents the available features in any article in the corpus. The vocabulary is reduced in two ways: tokens which are present in less than 5 articles are discarded, and a set of very popular words are also discarded. These both serve the purpose of reducing the number of features considered, but they have opposing motivations. Uncommon words are removed because they are only representative of a small subset of articles, which will not help us generate common themes between the articles, but will increase the computational complexity of the model. Common words, on the other hand, will be too representative of a large subset of articles, and will prevent us from dividing them into useful topics. For instance, I am collecting articles associated with a specific brand, thus, the brand is likely to appear multiple times in each document. We are not learning anything from knowing that the collected articles associated with the uber brand, talk about uber. I remove this words so that we can gain a more subtle understanding of what the topics are within the corpus. MongoDB's aggregation framework was particularly useful for processing this data and efficiently performing the features selection tasks.

### Topic Modelling

I use [gensim]'s implementation of [Latent Dirichlet allocation] (LDA) to generate topics from the corpus. LDA is a way of automatically generating topics from a set of documents based on observations of tokens used in those documents. LDA assumes that each document in the corpus is made up of a mixture of a set of unobserved topics. It generates topics in the form of pairs of token and a probability that that token will appear in a document on that topic. The topics are expressed as a series of tokens and probabilities, and thus are not defined. For instance, we do not know if a topic is about business, we have only a set of popular tokens in that category to determine what it is about. A reader then can get an idea of the topic by looking at the popular tokens and reading the articles belonging to that topic. As we saw before, however, the titles of the articles were sufficient to identify a general theme.

The two inputs for the model are the dictionary of features, remember, composed of popular-but-not-so-popular tokens and bigrams in the corpus, and the vectors of those tokens and the frequency with which they appear in each article. The output of the model is a set of topics, made up of a set of tokens and the probability that each token appears in an article in that topic.

Conversely, these probabilities can be transformed and used to ascertain the LDA determined percentage of content from each topic for a single article. This allows us to identify the articles that are most relevant to a specific topic.

### Presentation

The final module of the app is the presentation layer. All of the previous modules can only be understood by the reader if they are presented in a coherent manner. The data, articles and topics are stored in the Mongodb database. They are pulled out, organised and ranked by a web back end written in [Flask]. The articles and topics are then interpolated into a HTML templates developed using [bootstrap]. Finally the topic article plot was developed in javascript with the help of [d3]. The final result is a set of articles organised by topic and popularity. The application and all the underlying processes are running on a [Amazon web services] (aws) machine.

## Validation

How do we know the topics are relevant? How do we know the classification of articles is actually cohesive? How do we know the number of topics is the appropriate for the data? These are all hard questions, some of them quite difficult to address. But we must have some reasonable confidence that the model applied to the data is the appropriate one. We must know that the information that the model is actually organising the information in a meaningful way, in order for us to trust it. These are not rhetorical questions: money and reputation are on the line.

Topic modelling is difficult to validate, but one of the ways in which we can see whether the topics are relevant is a qualitative read over the articles themselves. Do they seem to be relevant? Do the topics look cohesive? As I talked about before, the topics lose cohesion the further down we go. Yet, the first few topics look very relevant: Articles about the business of uber, articles about uber's public image, and articles about uber's relationship with other institutions. The topics do seem to provide a way to organise the information that is relevant. Moreover, popular articles are generally included within the most relevant articles within a popular topic.

We can also look at how popular tokens within each topic overlap with each other. The distribution of important terms per topic should give us an idea of how independent each topic is from one another, whether the topics are redundant. These are not absolute measures because specific terms might be used differently in each topic. A term might have one meaning in one context, but a different in another. It is quite unlikely though that a large number of terms should have this behaviour.

![Popular terms in each topic from the articles associated with uber.][topic_terms]
Popular terms in each topic from the articles associated with uber.
{: .caption}

The analysis shows that the distribution of important terms in the 6 topics found within the articles associated with uber is quite regular. Few of the terms overlap in each category. The general topics of the articles are distinct enough that we can be confident that the articles are also about different themes. The distribution of topics for the other brands behave in a similar fashion.

Another question is whether the number of topics is appropriate for the corpus. This is particularly difficult with these types of applications because the number of articles and the types of articles can vary widely as they are being collected live. In the current version of the application I decided to limit the data two the first two weeks, mostly for practical purposes: I could not handle more data. This meant that the decision in the number of clusters was a little easier. One common heuristic used in clustering is the *elbow* method. This method suggests that the appropriate number of clusters is where adding more clusters stops adding explanatory value to the model. This occurs when there is a drop in the explained variation given by a new cluster.

<figure class="framed wide" markdown="1">
![][apple_topics]
{: .col-xs-6 }

![][facebook_topics]
{: .col-xs-6 }

![][google_topics]
{: .col-xs-6 }

![][uber_topics]
{: .col-xs-6 }

The number of clusters was chosen so as to explain the biggest amount the variation in the corpus without adding too much complexity to the model.
{:.caption}
</figure>


The value that worked best for the four brands using this method was 6. This number explains more variation in most of the brands without adding unwanted complexity to the model. The biggest variation of size in these clusters is within the articles associated with apple. This is because of the large amount of spam present in this subset. Even though the difference in size is large, it does help to filter out a lot of articles that are uninteresting, leaving a more appealing subset to the second cluster.

## Final Words

This application was built in three weeks during the [Insight Data Science] program. Most of the methods and technologies were new to me when I started this project and I've really enjoyed learning about them and using them for a practical application. If you have questions or if you want to know more about any of its parts please send me a message [alejandro.giacometti@gmail.com](mailto:alejandro.giacometti@gmail.com) or tweet me at [@janrito].

***

##### Slides

Here are some slides I used to talk about the project and my move into Data Science.


<div class="embed embed-4by3">
  <iframe src="//www.slideshare.net/slideshow/embed_code/44449097" ></iframe>
</div>


[apple_topics]: /images/wth/apple_topics.png "apple topics"
[facebook_topics]: /images/wth/facebook_topics.png "facebook topics"
[google_topics]: /images/wth/google_topics.png "google topics"
[uber_topics]: /images/wth/uber_topics.png "uber topics"
[topic_terms]: /images/wth/topic_terms.png "topic terms"
[tweets_histogram]: /images/wth/tweets_histogram.png "tweets histogram"
[tweets_per_brand]: /images/wth/tweets_per_brand.png "tweets per brand"
[tagcloud]: /images/wth/tagcloud.png "Brands TagCloud"
[uber_col1]: /images/wth/uber_col1.png "Uber topics and tracking"
[uber_col2]: /images/wth/uber_col2.png "Uber topics and tracking"
[uber_col3]: /images/wth/uber_col3.png "Uber topics and tracking"
[uber_popular]: /images/wth/uber_popular.png "Popular stories about uber"
[uber_topic1]: /images/wth/uber_topic1.png "Uber stories organised by topic"
[uber_topic2]: /images/wth/uber_topic2.png "Uber stories organised by topic"
[uber_topic3]: /images/wth/uber_topic3.png "Uber stories organised by topic"
[uber_topic_plot]: /images/wth/uber_topic_plot.png "Number of articles per topics "


[@janrito]: http://twitter.com/janrito "@janrito on Twitter"
[ag]: http://alejandro.giacometti.me "Alejandro Giacometti"
[ag]: http://alejandro.giacometti.me "Alejandro Giacometti"
[Amazon web services]: aws.amazon.com "Amazon web services"
[bootstrap]: http://getbootstrap.com/ "Bootstrap"
[celery]: http://www.celeryproject.org/
[d3]: http://d3js.org/ "D3.js"
[facebook]: http://facebook.com
[feedly]: http://feedly.com
[Flask]: http://flask.pocoo.org/ "Flask"
[gensim]: https://radimrehurek.com/gensim/ "gensim: topic modelling for humans"
[hacker news]: http://news.ycombinator.com
[Insight Data Science]: http://insightdatascience.com/ "Insight Data Science"
[kcl]: http://www.kcl.ac.uk/ "King's College London"
[Latent Dirichlet allocation]: http://en.wikipedia.org/wiki/Latent_Dirichlet_allocation "Latent Dirichlet allocation"
[MongoDB]: http://www.mongodb.org/ "MongoDB"
[nltk]: http://www.nltk.org/ "Natural Language Processing Toolkit"
[puppy bowl]: http://en.wikipedia.org/wiki/Puppy_Bowl "Puppy Bowl"
[python-goose]: https://github.com/grangier/python-goose "Python Goose"
[reddit]: http://reddit.com
[redis]: http://redis.io/
[Streisand Effect]: http://en.wikipedia.org/wiki/Streisand_effect "Streisand Effect"
[twitter api]: https://dev.twitter.com/rest/public "Twitter API"
[twitter]: http://twitter.com
[Twython]: https://twython.readthedocs.org/en/latest/
[ucl]: http://www.ucl.ac.uk "Univesity College London"
[wth]: http://wth.giacometti.me "What the Hashtag!?"

[review]: http://wth.giacometti.me/about "What the Hashtag!?"
