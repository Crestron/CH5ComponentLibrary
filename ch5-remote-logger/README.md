# 1. Introduction:
Integrators do not have the ability to use the Browser Dev Tools on the CH5 container applications on x60 and iOS. As such they have little insight into error messages or diagnostic console log messages that would be displayed in the console of these tools.

# 2. Prerequisites:
- Docker > 2.0.0 - if you are using Docker on a Windows machine, make sure to use **Linux containers**
- npm >= 6.4.1
- yarn >= 1.17.3
- node >= 8

# 3. Building the docker images:
Run the following command based on the desired environment, currently there are dev and prod environments available
- Build the docker image for development: `docker build . -t ch5-remote-logger:dev -f ./env/dev/Dockerfile`
- Build the docker image for production: `docker build . -t ch5-remote-logger:latest -f ./env/prod/Dockerfile`

# 4. Up and running:
To create the docker container within the remote-logger run:
- Dev: ``` docker run -p {8080}:80 ch5-remote-logger:dev```
- Production: ```docker run -p {8080}:80 ch5-remote-logger:latest ```

Now you should have an up and running container found at: http://127.0.0.1:8080

# 5. Runinng the container:
```bash
docker run -p {8080}:80 ch5-remote-logger:latest
```
This command create the container where the logs will be appended. You can check the containers running the following command: `docker ps`

# 6. Api endpoints:
- GET `/configuration` used to pull the filter configuration
- POST `/configuration` used to update the filter configuration
- POST `/log` used to add logs
- GET `/` is serving a HTML page for filter configuration 

# 7. Integration with a ch5 project:
Two steps to integrate with ch5-remote-logger:
```javascript
const appender = CrComLib.getRemoteAppender('{HOST}', '{PORT}');
const logger = CrComLib.getLogger(appender, true);
```
### Also you can specify a filter configuration:
```javascript
const appender = CrComLib.getRemoteAppender('{HOST}', '{PORT}');
const filterConfiguration = new CrComLib.LogMessagesFilter(2, 'Ch5SignalBridge.publish', 'send_event_on_tap');
const logger = CrComLib.getLogger(appender, true, filterConfiguration);
```

NOTE: On development, replace `{HOST}` with `localhost` and `{PORT}` with `8080`

# 8. Logger interface:
Hosted on `http://127.0.0.1:{8080}`. Use this interface to change the filter and check the log messages within a web interface. 

# 9. Docker image distribution without using a hub service:

### Distributor tasks:
- create the docker image build for production `docker build . -t ch5-remote-logger:latest -f ./env/prod/Dockerfile`
- save the docker image locally `docker save -o ./ch5-remote-logger.tar ch5-remote-logger:latest`
- send the `ch5-remote-logger.tar` file

### Receiver tasks:
- load `ch5-remote-logger.tar` into docker using: `docker load ./ch5-remote-logger.tar`
- do the step from chapter [4. Up and Running](#4-up-and-running)
