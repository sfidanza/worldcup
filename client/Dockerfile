# Stage 1
FROM node:14-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2
FROM nginx:alpine

WORKDIR /var/www/worldcup2014

RUN rm /etc/nginx/conf.d/default.conf
COPY sites-available/worldcup2014.conf /etc/nginx/conf.d

COPY --from=build /usr/src/app/target .
