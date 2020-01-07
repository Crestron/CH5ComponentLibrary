FROM node:8

WORKDIR /app
COPY ./ .

RUN mkdir -p log

RUN yarn
RUN mkdir -p ./api/public/
RUN yarn build-react
RUN yarn build-api

COPY ./app/public/ ./api/public/

CMD yarn start