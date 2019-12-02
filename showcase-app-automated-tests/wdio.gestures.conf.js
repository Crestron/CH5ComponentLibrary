// Let's load the default configs:
var defaults = require("./wdio.conf.js").config;
var _ = require("lodash");

// have main config file as default but overwrite environment specific information


var overrides = {
	// Here are all my 'dev' specific overrides:
    capabilities: [{
        // maxInstances can get overwritten per capability. So if you have an in-house Selenium
        // grid with only 5 firefox instances available you can make sure that not more than
        // 5 instances get started at a time.
        maxInstances: 1,
        //
        browserName: 'chrome',
        //       
        'goog:chromeOptions': {
            mobileEmulation: {'deviceName': 'iPhone X'},
            args: [
                'disable-extensions',
                'headless',
                'disable-gpu',
                'window-size=1920,1080',
                'log-level=3',
                'disable-dev-shm-usage'
            ]
        },      
        loggingPrefs: {
            'browser': 'INFO'
          }
    }],

    specs: [
        '.build/specs-gestures/*.gestures.specs.js'
    ]
};

exports.config = _.defaultsDeep(overrides, defaults);