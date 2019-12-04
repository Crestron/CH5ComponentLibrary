<p align="center">
  <img src="https://kenticoprod.azureedge.net/kenticoblob/crestron/media/crestron/generalsiteimages/crestron-logo.png">
</p>
 
# Creston Components library Unit Tests

- Tests are written in typescript
- Uses mocha, chai and ts-node

## Requirements

- Node and npm versions:
    - node v8.11.1 
    - npm v5.6.0  ( npm is not being used, yarn is used instead )
- Yarn v1.6.0 (https://yarnpkg.com/lang/en/docs/install)
- Global packages:
    - typescript 2.8.3
    
### Running the tests

- ```yarn install```
- ```yarn run test``` - runs all tests from src folder

### Running the tests in Webstorm

- add:``` --require src/tests/dom-mock.js --require ts-node/register``` to extra Mocha options from the edit configuration menu
