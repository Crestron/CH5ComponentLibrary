<p align="center">
  <img src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/crestron-logo.png">
</p>
 
#  Crestron Components Showcase Application Automated Tests - Getting Started

The tests are written using an open source testing utility for nodejs [WebdriverIO](http://webdriver.io/).
The reports are generated using [Allure Test Report](http://allure.qatools.ru/).

## Notes

The tests are currently only configured to run on Chrome.

The tests are configured to run in a headless environment by default, if you want to make the tests visible while running use the specified visible commands.
The gestures tests are currently not working on Chrome for Mac because of a known issue within chromedriver

- the issue can be found at <https://bugs.chromium.org/p/chromedriver/issues/detail?id=2144>
- until the known issue is fixed the gestures tests are not included in the ```yarn run test:all``` command, use ```yarn run test:gestures``` to run them.

## Things to do before running

### Install dependencies

From the current folder (the one containing this readme file) run:

```yarn install```

### Running

Make sure the showcase app is started on port 127.0.0.1:8080. Go to the showcase-app folder and run

```yarn start```

From the current folder (the one containing this readme file) run:

- to run all the tests

```yarn run test:all```
```yarn run test:all-visible``` 


- to run only the tests with gestures:

```yarn run test:gestures```
```yarn run test:gestures-visible```

- to run only the tests without gestures

```yarn test```
```yarn run test-visible``` 

- to run a specific spec file:

```yarn test -- --spec .build/specs/FILE_NAME.specs.js``` 
    (npm test -- --spec .build/specs/ch5-slider.specs.js -> to only run the ch5-slider tests for example)
```yarn run test-visible -- --spec .build/specs/FILE_NAME.specs.js```
    
### Reports

From the current folder (the one containing this readme file) run:

```yarn run reports``` - to generate a report from the folder "allure-results" and open it in the browser
```yarn run test:all``` - report results in junit xml format in folder "junit-xml" 
