# Stage 1
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2
FROM nginx:1.25.4-alpine

WORKDIR /var/www/worldcup

RUN rm /etc/nginx/conf.d/default.conf
COPY sites-available/worldcup.conf /etc/nginx/conf.d

COPY --from=build /usr/src/app/target .
