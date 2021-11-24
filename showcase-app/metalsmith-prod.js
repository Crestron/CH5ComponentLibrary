const metalsmith = require('metalsmith');
const assets = require('metalsmith-assets');
const markdown = require('metalsmith-markdown');
const nunjucks = require("nunjucks");
const inplace = require('metalsmith-in-place');
const static = require('metalsmith-static');
const sass = require('metalsmith-sass');
const browserSync = require('metalsmith-browser-sync');

nunjucks.configure('src', { watch: false, noCache: true });

// Dev Note: To debug metalsmith, remove browsersync

metalsmith(__dirname)
  .source("./src")
  .destination("./dist/downloads/ShowcaseApp")
  .clean(true)
  .metadata({
    "title": "Showcase App",
    "description": "Showcase App for Crestron Components",
    "siteurl": "/downloads/ShowcaseApp/"
  })
  .use(assets({
    "source": "./node_modules/@crestron/ch5-crcomlib/build_bundles/umd/",
    "destination": "./cr-com-lib"
  }))
  .use(assets({
    "source": "./node_modules/@crestron/ch5-theme/output/",
    "destination": "./crestron-components-assets"
  }))
  .use(markdown())
  .use(inplace({}))
  .use(static({
    "src": "./static",
    "dest": "."
  }))
  .use(sass({
    "outputDir": "css/",
    "sourceMap": true,
    "sourceMapContents": true
  }))
  .build(function (err, files) {
    if (err) { throw err; }
  });
