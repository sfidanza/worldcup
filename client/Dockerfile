# Stage 1
FROM node:19-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2
FROM nginx:1.24.0-alpine

WORKDIR /var/www/worldcup

RUN rm /etc/nginx/conf.d/default.conf
COPY sites-available/worldcup.conf /etc/nginx/conf.d

COPY --from=build /usr/src/app/target .
