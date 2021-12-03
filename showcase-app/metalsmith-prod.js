const metalsmith = require('metalsmith');
const assets = require('metalsmith-assets');
const markdown = require('metalsmith-markdown');
const nunjucks = require("nunjucks");
const inplace = require('metalsmith-in-place');
const static = require('metalsmith-static');
const sass = require('metalsmith-sass');

nunjucks.configure('src', { watch: false, noCache: true });

const args = process.argv;
let path = args[2];
if (!(path && path !== "")) {
  path = "downloads/ShowcaseApp";
}

metalsmith(__dirname)
  .source("./src")
  .destination("./dist/" + path)
  .clean(true)
  .metadata({
    "title": "Showcase App",
    "description": "Showcase App for Crestron Components",
    "siteurl": "/" + path + "/"
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
