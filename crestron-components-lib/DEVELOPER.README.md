# Creston CH5 Components Library - Developer Readme

## Build Requirements

- Node and npm versions:
- node v8.11.1
- npm v5.6.0  ( npm is not being used, yarn is used instead )
- Yarn v1.6.0 ("https://yarnpkg.com/lang/en/docs/install")
- Global packages:
-- typescript 2.8.3

### Available yarn commands

- yarn clean:build - removes the build_bundles folder
- yarn clean:compiled - removes the compiled_bundles folder
- yarn clean:docs - removes the docs folder
- yarn compile:ts - currently the same as yarn compile:ts:umd with the addition that it clears the compiled_bundles folder
 before running
- yarn clean:ci:dev - removes the build_bundles_dev folder
- yarn compile:ts:cjs - uses the typescript (tsc) compiler to output compiled js files and typescript definition files to
the compiled_bundles/cjs folder
- yarn compile:ts:esm - uses the tsc compiler to output js files and typescript definition  
files to the compiled_bundles/esm folder
- yarn compile:ts:umd  uses the tsc compiler to output js files and typescript definition  
files to the compiled_bundles/umd folder
- yarn compile:ts:amd - uses the tsc compiler to output js files and typescript definition  
files to the compiled_bundles/amd folder
- yarn build:dev - currently the same as yarn build:dev:umd with the addition the it clears the build_bundles folder first
- yarn build:prod - currently the same as yarn build:prod:umd with the addition the it clears the build_bundles folder first
- yarn build:dev:cjs - creates a development bundle in build_bundles/cjs
- yarn build:prod:cjs - creates a production bundle in build_bundles/cjs
- yarn build:dev:cjs-no-ce - creates a development bundle in build_bundles/cjs-no-ce ( for browsers that do not support customElement )
- yarn build:prod:cjs-no-ce - creates a production bundle in build_bundles/cjs-no-ce ( for browsers that do not support customElement )
- yarn build:dev:esm - creates a development bundle in build_bundles/lib-esm ( compiles using tsc )
- yarn build:prod:esm - creates a production bundle in build_bundles/lib-esm ( compiles using tsc )
- yarn build:dev:umd - creates a development bundle in build_bundles/umd
- yarn build:prod:umd - creates a production bundle in build_bundles/umd
- yarn build:dev:amd - creates a development bundle in build_bundles/amd
- yarn build:prod:amd - creates a production bundle in build_bundles/amd
- yarn build:dev:umd-no-ce - creates a development bundle in build_bundles/umd-no-ce ( for browsers that do not support customElement )
- yarn build:prod:umd-no-ce - creates a production bundle in build_bundles/umd-no-ce ( for browsers that do not support customElement )
- yarn build:dev:amd-no-ce - creates a development bundle in build_bundles/amd-no-ce ( for browsers that do not support customElement )
- yarn build:prod:amd-no-ce - creates a production bundle in build_bundles/amd-no-ce ( for browsers that do not support customElement )
- yarn build:dev_all - shortcut for building all development bundles; clears the build_bundles folder first
- yarn build:prod_all - shortcut for building all production bundles; clears the build_bundles folder first
- yarn build:ci:dev:amd - creates a development bundle in build_bundles_dev/amd
- yarn build:ci:dev:cjs - creates a development bundle in build_bundles_dev/cjs
- yarn build:ci:dev:umd - creates a development bundle in build_bundles_dev/umd
- yarn build:prod_publish - shortcut for building production bundles: amd, cjs, umd; cleans the build_bundles folder first
- yarn build:ci:dev_publish - shortcut for building dev bundles for CI: amd, cjs, umd; cleans the build_bundles_dev folder first
- yarn lint -  runs the linter, does not pass through webpack
- yarn test:mocha - compiles the typescript files into UMD module then runs the mocha tests
- yarn doc:html - generates the html documentation in docs/html
- yarn doc:json - generates the json documentation in docs/json
- yarn doc - shortcut for clearing the docs folder and generating both the html and json documentation
- yarn test:wct - starts http-server instance in the main folder and opens a browser window  
- yarn wct-xml-report - generates wct xml report in test-report.xml

NOTES

- currently the ES target for the library is set to ES6 instead of ES5.

## Running the tests from the wct_tests folder

Make sure bower is installed
```bower --version```

If not then install it
```npm -g install bower```

Install the bower dependencies
```bower install```

Build the library
```yarn build:dev```

Open a http-server
```yarn test:wct```

Note the port and navigate to "http://localhost:port/wct_tests"

### Running the tests from the wct_tests folder and generating xml report

Make sure that you have Java installed and available on your PATH

Start Selenium and build report
```yarn wct:xml-report```

### Generic dev reference

A custom element must always have a closing tag to render. A simple "< custom-element/>" won't suffice. It should consist the closing tag too "< custom-element><//custom-element>".
"https://stackoverflow.com/questions/23961178/do-custom-elements-require-a-close-tag?answertab=active#tab-top"
