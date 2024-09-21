FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN node --run lint
RUN node --run test

CMD [ "node", "--run", "start" ]