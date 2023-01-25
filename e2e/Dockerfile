FROM mcr.microsoft.com/playwright:v1.30.0-focal

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
# RUN npm run test

