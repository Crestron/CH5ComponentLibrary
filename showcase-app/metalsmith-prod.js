const metalsmith = require('metalsmith');
const assets = require('metalsmith-assets');
const markdown = require('metalsmith-markdown');
const nunjucks = require("nunjucks");
const inplace = require('metalsmith-in-place');
const static = require('metalsmith-static');
const sass = require('@metalsmith/sass');
const fs = require('fs');

const menu = JSON.parse(fs.readFileSync('./src/menu.json'));
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
    "siteurl": "/" + path + "/",
    "menuItems": menu.menuItems
  })
  .use(static({
    "src": "./static",
    "dest": "."
  }))
  .use(assets({
    "source": "./node_modules/@crestron/ch5-crcomlib/build_bundles/umd/",
    "destination": "./cr-com-lib"
  }))
  .use(assets({
    "source": "./node_modules/@crestron/ch5-theme/output/themes/",
    "destination": "./crestron-components-assets"
  }))
  .use(markdown())
  .use(inplace({}))
  .use(sass({
    style: 'compressed',
    sourceMap: true,
    sourceMapIncludeSources: true,
    loadPaths: ['src'],
    entries: {
      // add scss entry points from
      'src/scss/main.scss': 'css/main.css',
      'src/scss/normalize.scss': 'css/normalize.css'
    }
  }))
  .build(function (err, files) {
    if (err) { throw err; }
  });
