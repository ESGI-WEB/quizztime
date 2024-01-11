FROM node:20.0.0-alpine as build

WORKDIR /home/node

RUN npm install
RUN npm run build
CMD ["npm", "run", "dev"]