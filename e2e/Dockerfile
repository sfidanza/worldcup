FROM mcr.microsoft.com/playwright:v1.54.2-noble

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
# RUN npm run test

