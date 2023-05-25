FROM mcr.microsoft.com/playwright:v1.34.3-focal

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
# RUN npm run test

