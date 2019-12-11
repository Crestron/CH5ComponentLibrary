<p align="center">
  <img src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/crestron-logo.png">
</p>
 
# Crestron Components Showcase Application - Getting Started
 
#### Continuous Integration and Deployment Status

| DEV NIGHTLY - latest-dev | Status |
| ------ | ----------- |
| Build Pipeline | Work In Progress |
| Release Pipeline - Azure Blob | Work In Progress |
| Release Pipeline - Publish to NPM | Work In Progress |

| MASTER-QE - latest-qe | Status |
| ------ | ----------- |
| Build Pipeline | Work In Progress |
| Release Pipeline - Azure Blob | Work In Progress |
| Release Pipeline - Publish to NPM | Work In Progress |

Showcases the Crestron Webcomponents

The showcase is generated using a lightweight static site generator: [metalsmith](http://www.metalsmith.io/)
The templating used is [nunjucks](https://mozilla.github.io/nunjucks/templating.html)
Syntax highlighting is acomplished with [prismjs](https://prismjs.com/)
For styling [bulma](https://bulma.io/documentation)
Uses [WebComponentsJs polyfills](https://github.com/WebComponents/webcomponentsjs) from the 
[unpkg.com CDN](https://unpkg.com/@webcomponents/webcomponentsjs@2.1.3/)

It should be possible to switch, if needed, to a more powerful/known/used static site generator like Hugo (golang) or Jekyll (ruby). 

## What to do before building or running

### Ensure the proper version of Crestron Components Library is installed

Open package.json and find the line containing **"@crestron/ch5-crcomlib": "x.y.z".**

Update the version to the desired one from [npmjs](https://www.npmjs.com/package/@crestron/ch5-crcomlib)

###  Install dependencies

From the current folder (the one containing this readme file), run:

```yarn install```

## Building

From the current folder (the one containing this readme file), run:

```yarn build```

This will generate a folder named 'dist' with the needed files

### Defining siteurl 

If you need to use absolute paths or need to deploy the showcase app under a different folder, you can change the siteurl
key from metalsmith.json.
For a subfolder, you can use "siteurl":"/subfolder/"
For an absolute path, you can use "siteurl":"https://my.domain.com/subfolder/"

  
## Running

From the current folder (the one containing this readme file), run:

```yarn start```

This will execute the build script and will also start a http-server on port 8080 that serves the files. 
Curently, there is no watch functionality. This means that after running yarn start, in order to see modifications made 
in the Showcase App, you should  *yarn build* again (you can keep the server running). If the change was made in the
components library then, you should also build that again.  

## Useful Info About Metalsmith Template Paths 

When including another template or partial (such as say tplA.njk), in another template (such as tblB.njk):
- if tplB.njk is located in the src folder, then the include path should be relative to the *package.json* file.
- if tplB.njk is not located in the src folder, then the include path should be relative to tplB.njk


https://mozilla.github.io/nunjucks/templating.html



