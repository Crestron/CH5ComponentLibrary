const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const chalk = require('chalk');
const WrapperPlugin = require('wrapper-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require("copy-webpack-plugin");

const ENV = process.env.NODE_ENV;
const envLabels = {
    'prod': 'PRODUCTION',
    'dev': 'DEVELOPMENT',
    'test': 'TEST'
};

let envLabel = 'unknown';
if (envLabels[ENV]) {
    envLabel = envLabels[ENV];
}

const NO_CE = process.env.NO_CE;
// Webpack can use the commonjs output compiled by typescript to build the amd, commonjs and umd module types
let tsConfigFileName = 'tsconfig.webpack_implicit_ce.json';
if (NO_CE === '1') { // for browsers that do not support customElements
    tsConfigFileName = 'tsconfig.webpack.json';
}

const basePath = path.resolve(__dirname);
const MODULE_TYPE = process.env.MODULE_TYPE;





const moduleTypes = ['cjs', 'umd', 'amd']; // 'esm' cannot be obtained from webpack, will be compiled with tsc
let moduleType = 'umd'; // UMD includes commonjs, amd and attaching a property to the window object
if (process.env.MODULE_TYPE && moduleTypes.indexOf(process.env.MODULE_TYPE) >= 0) {
    moduleType = process.env.MODULE_TYPE;
}
let libraryTarget = 'umd';
switch (moduleType) {
    case 'cjs':
        libraryTarget = 'commonjs2';
        break;
    case 'amd':
        libraryTarget = 'amd';
        break;
    default:
        libraryTarget = 'umd';
        break;
}

let moduleBuildFolder = moduleType;
if (NO_CE === '1') { // for browsers that do not support customElements
    moduleBuildFolder = moduleType + '-no-ce';
}

const bundledThemesPath = basePath + '/../crestron-components-sass/output/';
let buildPath = path.resolve(basePath, 'build_bundles', moduleBuildFolder);

const CI = process.env.CI;

if (CI) {
    buildPath = path.resolve(basePath, 'build_bundles_dev', moduleBuildFolder);
}


console.log(`${chalk.underline('Running in Environment:')} ${chalk.bold.green(envLabel)}`);
process.noDeprecation = true;
module.exports = function () {
    return {
        entry: {
            'cr-com-lib': [
                path.resolve(__dirname, 'src')
            ],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(basePath, tsConfigFileName),
                        logLevel: 'info'
                    }
                },
                {
                    test: /\.ts$/,
                    enforce: 'pre',
                    loader: 'tslint-loader',
                    options: {
                        configFile: path.resolve(basePath, 'tslint.json'),
                        tsConfigFile: path.resolve(basePath, tsConfigFileName)
                    }
                }
            ]
        },
        plugins: [
            new CopyPlugin( [
                    { 
                        from: path.resolve(basePath, "src/_interfaces/generated-metadata/schema.json"), 
                        to: path.resolve(buildPath, "generate-metadata") 
                    }
                ],
            ),
            new webpack.BannerPlugin({
                banner:
                    "Copyright (C) " + ((new Date()).getFullYear()) + " to the present, Crestron Electronics, Inc.\n" +
                    "All rights reserved.\n" +
                    "No part of this software may be reproduced in any form, machine\n" +
                    "or natural, without the express written consent of Crestron Electronics.\n" +
                    "Use of this source code is subject to the terms of the Crestron Software License Agreement\n" +
                    "under which you licensed this source code.\n" +
                    "\n"
            }),
            new WrapperPlugin({
                test: /\.js$/, // only wrap output of bundle files with '.js' extension 
                footer: function () {
                    if (MODULE_TYPE !== 'cjs' && MODULE_TYPE !== 'amd') {
                        const pathToFooterFile = path.resolve('extra/footer-umd-package.js');

                        if (fs.existsSync(pathToFooterFile)) {
                            const footerContent = fs.readFileSync(pathToFooterFile);
                            return footerContent;
                        }

                    }
                }
            }),
            new Dotenv()
        ],

        resolve: {
            extensions: ['.tsx', '.ts', '.js']
        }
    };
};