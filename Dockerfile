FROM node:20.0.0-alpine as build

USER node

WORKDIR /home/node

COPY --chown=node:node . .

RUN npm install
RUN npm run build

FROM node:20.0.0-alpine as production

USER node

WORKDIR /home/node

COPY --chown=node:node --from=build /home/node/package.json /home/node/package.json
COPY --chown=node:node --from=build /home/node/.next /home/node/.next

RUN npm install --omit dev

CMD ["npm", "start"]
