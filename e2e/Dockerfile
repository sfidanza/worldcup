FROM mcr.microsoft.com/playwright:v1.48.0-focal

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
# RUN npm run test

