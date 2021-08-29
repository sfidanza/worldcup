FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run lint --silent
RUN npm run test

CMD [ "npm", "start" ]