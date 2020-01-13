FROM node:8 as remote-logger-builder

WORKDIR /app
COPY ./ .

RUN mkdir -p log

RUN yarn
RUN mkdir -p ./api/public/
RUN yarn build-react
RUN yarn build-api

COPY ./app/public/ ./api/public/

FROM alpine

RUN apk add --update nodejs
RUN apk add --update yarn

WORKDIR /app
COPY --from=remote-logger-builder /app/api/dist /app/api/dist
COPY --from=remote-logger-builder /app/api/public/ /app/api/public
COPY --from=remote-logger-builder /app/package.json /app

RUN mkdir -p log && \
    yarn install --production --ignore-optional --link-duplicates --no-bin-links --no-cache && \
    yarn cache clean && \
    rm -rf /var/cache && \
    rm -rf /var/tmp
CMD node api/dist/src/index.js