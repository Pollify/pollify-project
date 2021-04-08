ARG SERVICE="./services/discord-service"

FROM node:lts-alpine as base
# Reuse build-arg
ARG SERVICE

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN chown -R node:node .

USER node

COPY --chown=node:node $SERVICE/package.json .
COPY --chown=node:node $SERVICE/package-lock.json .
RUN npm ci

# Peer dependencies
COPY --chown=node:node $SERVICE/../../packages/logger/package.json /usr/packages/logger/package.json
RUN npm install --prefix ../../packages/logger
COPY --chown=node:node $SERVICE/../../packages/logger /usr/packages/logger
RUN npm run build --prefix ../../packages/logger
RUN npm run pack --prefix ../../packages/logger
RUN npm install ../../packages/logger/pollify-logger-*.tgz

COPY --chown=node:node $SERVICE/ .

FROM base as dev
CMD ["npm", "run", "start:dev"]

FROM base as build

WORKDIR /usr/src/app

RUN npm run build

FROM build
WORKDIR /usr/src/app

EXPOSE 8080

CMD [ "node", "dist/main.js" ]