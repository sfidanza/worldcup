FROM mcr.microsoft.com/playwright:v1.39.0-focal

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
# RUN npm run test

