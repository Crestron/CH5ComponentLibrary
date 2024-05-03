# Crestron CH5 Components Library - Developer Readme

## Build Requirements

- Node and npm versions:
- node v20.4.0
- npm v9.7.2 
- Global packages:
-- typescript 5.1.6

### Available Scripts

- npm run clean:build - removes the build_bundles folder
- npm run clean:compiled - removes the compiled_bundles folder
- npm run clean:docs - removes the docs folder
- npm run compile:ts - currently the same as npm run compile:ts:umd with the addition that it clears the compiled_bundles folder
 before running
- npm run clean:ci:dev - removes the build_bundles_dev folder
- npm run compile:ts:cjs - uses the typescript (tsc) compiler to output compiled js files and typescript definition files to
the compiled_bundles/cjs folder
- npm run compile:ts:esm - uses the tsc compiler to output js files and typescript definition  
files to the compiled_bundles/esm folder
- npm run compile:ts:umd  uses the tsc compiler to output js files and typescript definition  
files to the compiled_bundles/umd folder
- npm run compile:ts:amd - uses the tsc compiler to output js files and typescript definition  
files to the compiled_bundles/amd folder
- npm run build:dev - currently the same as npm run build:dev:umd with the addition the it clears the build_bundles folder first
- npm run build:prod - currently the same as npm run build:prod:umd with the addition the it clears the build_bundles folder first
- npm run build:dev:cjs - creates a development bundle in build_bundles/cjs
- npm run build:prod:cjs - creates a production bundle in build_bundles/cjs
- npm run build:dev:cjs-no-ce - creates a development bundle in build_bundles/cjs-no-ce ( for browsers that do not support customElement )
- npm run build:prod:cjs-no-ce - creates a production bundle in build_bundles/cjs-no-ce ( for browsers that do not support customElement )
- npm run build:dev:esm - creates a development bundle in build_bundles/lib-esm ( compiles using tsc )
- npm run build:prod:esm - creates a production bundle in build_bundles/lib-esm ( compiles using tsc )
- npm run build:dev:umd - creates a development bundle in build_bundles/umd
- npm run build:prod:umd - creates a production bundle in build_bundles/umd
- npm run build:dev:amd - creates a development bundle in build_bundles/amd
- npm run build:prod:amd - creates a production bundle in build_bundles/amd
- npm run build:dev:umd-no-ce - creates a development bundle in build_bundles/umd-no-ce ( for browsers that do not support customElement )
- npm run build:prod:umd-no-ce - creates a production bundle in build_bundles/umd-no-ce ( for browsers that do not support customElement )
- npm run build:dev:amd-no-ce - creates a development bundle in build_bundles/amd-no-ce ( for browsers that do not support customElement )
- npm run build:prod:amd-no-ce - creates a production bundle in build_bundles/amd-no-ce ( for browsers that do not support customElement )
- npm run build:dev_all - shortcut for building all development bundles; clears the build_bundles folder first
- npm run build:prod_all - shortcut for building all production bundles; clears the build_bundles folder first
- npm run build:ci:dev:amd - creates a development bundle in build_bundles_dev/amd
- npm run build:ci:dev:cjs - creates a development bundle in build_bundles_dev/cjs
- npm run build:ci:dev:umd - creates a development bundle in build_bundles_dev/umd
- npm run build:prod_publish - shortcut for building production bundles: amd, cjs, umd; cleans the build_bundles folder first
- npm run build:ci:dev_publish - shortcut for building dev bundles for CI: amd, cjs, umd; cleans the build_bundles_dev folder first
- npm run lint -  runs the linter, does not pass through webpack
- npm run test:mocha - compiles the typescript files into UMD module then runs the mocha tests
- npm run doc:html - generates the html documentation in docs/html
- npm run doc:json - generates the json documentation in docs/json
- npm run doc - shortcut for clearing the docs folder and generating both the html and json documentation
- npm run test:wct - starts http-server instance in the main folder and opens a browser window  
- npm run wct-xml-report - generates wct xml report in test-report.xml

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
```npm run build:dev```

Open a http-server
```npm run test:wct```

Note the port and navigate to "http://localhost:port/wct_tests"

### Running the tests from the wct_tests folder and generating xml report

Make sure that you have Java installed and available on your PATH

Start Selenium and build report
```npm run wct:xml-report```

### Generic developer reference

A custom element must always have a closing tag to render. A simple "< custom-element/>" won't suffice. It should consist the closing tag too "< custom-element><//custom-element>".
"https://stackoverflow.com/questions/23961178/do-custom-elements-require-a-close-tag?answertab=active#tab-top"

### Development checklist
1. Ensure that ```tsc -p tsconfig.umd.json``` is executed and any warnings and errors are addressed.
2. Ensure to run ```npm run lint``` to identify linting errors.
3. Execute wct cases to ensure completion of tasks.
4. Do not use 'the template item surrounded by {{ }} delimiters'. The empty delimiters in the comments will fail. Use {{ delimiters }} instead.