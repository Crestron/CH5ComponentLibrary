<p align="center">
  <img src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/crestron-logo.png">
</p>
 
# Extension metadata generator - Getting Started

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

This folder contains the code that powers the metadata generator.

## Command line arguments

- ```-p | --path <path>``` Typescript path that contains the exported type definitions (e.g. ```path/to/index/file```)
- ```-t | --types <names>``` Typescript type names list (in case you wish to pass a list of types to extract metadata from)
- ```-at | --allTypes``` Flag that tells the generator to just generate for every type reflected (except those marked with ```@ignore```)
- ```-wr | --writeto``` Specifies the path where to write the schema json file.

## Tech

The generator uses a number of open source projects to work properly:

- [ajv](https://github.com/epoberezkin/ajv) - The fastest JSON schema validator.
- [commander](https://github.com/tj/commander.js/) - Node.js command-line interfaces made easy.
- [glob](https://github.com/isaacs/node-glob) - Glob functionality for node.js.
- [linq](https://github.com/mihaifm/linq) - LINQ for Typescript.
- [typescript](https://www.typescriptlang.org/) - The typescript platform.

## How to run

The generator requires [Node.js](https://nodejs.org/) v6+ to run.
Install the dependencies and devDependencies and run the generate command.

```sh
cd ./crestron-metadata-generator
yarn install
yarn run build
yarn run gen:metadata
```

The ```gen:metadata``` command is initialized to read from the interfaces declaration folder and output the schema in the generated-metadata folder:

```ts-node generator.ts --path ../crestron-components-lib/src/_interfaces/index.ts --allTypes --writeto ../crestron-components-lib/src/_interfaces/generated-metadata/schema.json```

## Copyright


Copyright (C) 2018 to the present, Crestron Electronics, Inc.
All rights reserved.
No part of this software may be reproduced in any form, machine
or natural, without the express written consent of Crestron Electronics.
Use of this source code is subject to the terms of the Crestron Software License Agreement
under which you licensed this source code.
