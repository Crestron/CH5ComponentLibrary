
const webpackMerge = require('webpack-merge');
const webpackCommon = require('./webpack.common.config');

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

const NO_CE = process.env.NO_CE;
let moduleBuildFolder = moduleType;
if (NO_CE === '1') { // for browsers that do not support customElements
    moduleBuildFolder = moduleType + '-no-ce';
}

const path = require('path');
const basePath = path.resolve(__dirname);
const bundledThemesPath = basePath + '/../crestron-components-sass/output/';
const buildPath = path.resolve(basePath, 'build_bundles', moduleBuildFolder);

module.exports = function () {
    return webpackMerge(webpackCommon(), {
        mode: 'production',
        target: 'web',
        output: {
            path: buildPath,
            filename: '[name].js',
            libraryTarget: libraryTarget,
            library: 'CrComLib',
            // in case we need different names:
            // library: {
            //     root: "CrComLib",
            //     amd: "CrComLib",
            //     commonjs: "CrComLib"
            // },
            umdNamedDefine: true
        },
        stats: 'verbose',
        performance: { hints: false }
    })
};
