FROM mcr.microsoft.com/playwright:v1.49.1-noble

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
# RUN npm run test

