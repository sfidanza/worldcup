FROM mcr.microsoft.com/playwright:v1.28.0-focal

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
# RUN npm run test

