FROM mcr.microsoft.com/playwright:v1.45.3-focal

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
# RUN npm run test

