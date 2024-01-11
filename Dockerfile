FROM node:20.0.0-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install -g next
RUN npm install

COPY . .
RUN npm run build