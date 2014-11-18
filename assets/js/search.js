require(['config'], function (config) {
  require(['js/main'], function (main) {return;});

  require([
    'jquery',
    'lunr',
    'lunr.stemmer.support',
    'lunr.es',
    'localforage',
    'mustache'],
    function ($, lunr, stemmerSupport, es, store, m) {
      var index_url = '/api/index.jsonp',
        pages, idx, resultsTemplate;

      stemmerSupport(lunr); // adds `lunr.stemmerSupport`
      es(lunr); // adds `lunr.es` key

      var excerpt = function() {
        return this.content.substring(0,250) + ' [...]';
      };

      var parse_pages = function (raw) {
        // maps the index into a lunr friendly array
        return raw.map(function (q) {
          return {
            url: q.url,
            title: q.title,
            content: q.content,
            tags: q.tags.join(' '),
            lang: q.lang,
            categories: q.categories.join(' ')
          };
        });
      };

      var create_index = function(raw) {
        // index data model
        idx = lunr(function () {
          this.use(lunr.es)

          this.field('title', { boost: 10 });
          this.field('categories', { boost: 5 });
          this.field('tags', { boost: 5 });
          this.field('content');
          this.ref('url');

          this.pipeline.remove(lunr.stemmer);
          this.pipeline.before(lunr.es.stopWordFilter, lunr.stopWordFilter);
        });

        pages = parse_pages(raw);

        // store pages in localstorage
        store.setItem('pages', JSON.stringify(pages));

        pages.forEach(function (page) {
          // add each page to the index
          idx.add(page);
        });

        // store idx in localstorage
        store.setItem('idx', JSON.stringify(idx.toJSON()));
      };

      var do_query = function(event) {
        event.preventDefault();

        var query = $(this).find('#q').val(),
        results = idx.search(query).map(function (result) {
            // match the reference from each result to
            // the page
            return pages.filter(function (q) {
              return q.url === result.ref;
            })[0];
          });

        // render results into template
        var resultsHTML = m.render(resultsTemplate,
         {'results': (results.length)? results: null,
         'excerpt': excerpt});

        // append results to document
        $('#search-results').html(resultsHTML);
      };

      var retreive_by_ajax = function() {
        // retreive static index
        $.ajax({
          dataType: "jsonp",
          url: index_url,
          jsonpCallback: 'callback',
          success: create_index,
          error: function (raw, textStatus, error) {
            console.log('error', error, textStatus);
          }
        });
      };

      $( document ).ready(function() {
        resultsTemplate = $('#results-template').text();
        //parse the mustache template (for faster rendering)
        m.parse(resultsTemplate);

        // first attempt to retreive from local storage
        store.getItem('pages', function(err, value) {
          var retreivalfailed = false;
          if (err) {
            retreivalfailed = true;
          } else {
            pages = JSON.parse(value);
            store.getItem('idx', function(err, value) {
              if (err) {
                retreivalfailed  = true;
              } else {
                try {
                  var dataDump = JSON.parse(value);
                  console.time('load');
                  idx = lunr.Index.load(dataDump);
                  console.timeEnd('load');
                } catch (err) {
                  retreivalfailed = true;
                }
              }
              if (retreivalfailed || !idx || !pages) {
                console.log('localstorage retreival failed, attempting to build new index');
                // if it fails, build it from jsonp index
                retreive_by_ajax();
              }
            });
          }
        });

        // bind event on keypress
        $('#q').keypress(function (e) {
          if (e.which == 13) {
            // submit form
            $('#search-form').trigger('submit');

            // prevent default, and stop propagation
            return false;
          }
        });

        // bind event on search submit
        $('#search-form').on('submit', do_query);
      });
  });
});

// "url": {{ site.base_url }}{{post.url | jsonify  }},
// "title": {{post.title | markdownify | strip_html | jsonify  }},
// "date": {{post.date | date_to_xmlschema | jsonify  }},
// "categories": {{post.categories | jsonify  }},
// "tags": {{post.tags | jsonify  }},
// "content": {{post.content | markdownify | strip_html | jsonify }},