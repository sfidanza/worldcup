FROM node:14-alpine

WORKDIR /usr/src/app

RUN npm install -g grunt-cli
COPY package*.json ./
RUN npm install

COPY . .
RUN grunt prod
RUN mkdir -p /var/www/worldcup2014 && cp -R ./target/* /var/www/worldcup2014

CMD [ "npm", "start" ]