# janrito.github.io 


Public facing site. Nth iteration.


## Setup Instructions

`Jekyll` & `github-pages` based static blog. Follow the instructions below to set up the local development environment (From [jekyll-instructions][]).

1. Ruby version must start with `1.9.3` or `2.0.0`
2. Install bundler:
    `gem install bundler`
3. Install the `github-pages` bundle, which contains the gems needed for `jekyll dev`
    + `Gemfile` should include the appropriate packages:
        
        ```
        source 'https://rubygems.org'
        gem 'github-pages'
        ```
    + Install using the `bundler` command:
        `bundle install`
4. Run local jekyll:
    `bundle exec jekyll --watch serve`
5. Until `github-pages` starts using `jekyll >= 2.0` scss files must be compiled manually and commited to the repository:

    ```
    scss assets/css/main.scss > assets/css/main.css
    ```

[jekyll-instructions]: https://help.github.com/articles/using-jekyll-with-pages