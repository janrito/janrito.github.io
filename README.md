# janrito.github.io

Public facing site. Nth iteration.

## Setup Instructions

`Jekyll` & `github-pages` based static blog. Follow the instructions below to set up the local development environment (From [jekyll-instructions][]).

1. Ruby version must start with `1.9.3` or `2.0.0`
2. Install bundler:
   `gem install bundler`
3. Install the `github-pages` bundle, which contains the gems needed for `jekyll dev`

   - `Gemfile` should include the appropriate packages:

     ```
     source 'https://rubygems.org'
     gem 'github-pages', group: :jekyll_plugins
     ```

   - Install using the `bundler` command:
     `bundle install`

   - (Maybe install webrick)
     `bundle add webrick`

     [according to the docs](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/testing-your-github-pages-site-locally-with-jekyll)

4. Run local jekyll:
   `bundler exec jekyll serve --watch --config _config.yml,_config_dev.yaml`

[jekyll-instructions]: https://help.github.com/articles/using-jekyll-with-pages
