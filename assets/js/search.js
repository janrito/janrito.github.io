require(['config'], function (config) {
  require(['js/main'], function (main) {return;});

  require(['jquery', 'lunr', 'mustache'], function ($, l, m) {
    var index_url = '/api/index.jsonp?index',
      pages, idx;


    idx = l(function () {
      this.field('title', { boost: 10 });
      this.field('categories', { boost: 5 });
      this.field('tags', { boost: 5 });
      this.field('content');
      this.ref('url');
    });

    var excerpt = function() {
      return this.content.substring(0,250) + ' [...]';
    }

    var create_index = function(raw) {
      pages = raw.map(function (q) {
        return {
          url: q.url,
          title: q.title,
          content: q.content,
          tags: q.tags.join(' '),
          categories: q.categories.join(' ')
        };
      });
      console.log(pages);
      pages.forEach(function (page) {
        idx.add(page);
      });
    };



    $( document ).ready(function() {
      var resultsTemplate =$('#results-template').text();

      m.parse(resultsTemplate);

      $.ajax({
        dataType: "jsonp",
        url: index_url,
        jsonpCallback: 'callback',
        success: create_index,
        error: function (raw, textStatus, error) {
          console.log('error', error, textStatus);
        }
      });

      $('#search-form').on('submit', function (event) {
        event.preventDefault();

        var query = $(this).find('#q').val(),
          results = idx.search(query).map(function (result) {
            // match the reference from each result to
            // the page
            return pages.filter(function (q) {
              return q.url === result.ref;
            })[0];
          });

        console.log(query);
        console.log(resultsTemplate);

        var resultsHTML = m.render(resultsTemplate,
                 {'results': (results.length)? results: null,
                  'excerpt': excerpt});

        $('#search-results').html(resultsHTML);

        console.log(results);
      })
    });

  });
});

// "url": {{ site.base_url }}{{post.url | jsonify  }},
// "title": {{post.title | markdownify | strip_html | jsonify  }},
// "date": {{post.date | date_to_xmlschema | jsonify  }},
// "categories": {{post.categories | jsonify  }},
// "tags": {{post.tags | jsonify  }},
// "content": {{post.content | markdownify | strip_html | jsonify }},