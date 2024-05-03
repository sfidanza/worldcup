# Stage 1
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2
FROM nginx:1.26.0-alpine

WORKDIR /var/www/worldcup
COPY --from=build /usr/src/app/target .

RUN rm /etc/nginx/conf.d/default.conf
COPY sites-available/worldcup.conf.template /etc/nginx/templates/
# /etc/nginx/templates/ is a docker entrypoint that will be resolved through `envsubst`
