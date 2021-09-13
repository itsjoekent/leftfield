FROM node:16-alpine

ARG EDGE_DOMAIN
ENV EDGE_DOMAIN $EDGE_DOMAIN

WORKDIR /usr/src/code

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build:baseball:presentation && npm run build:task:manufacture:remote

CMD ["npm", "run", "start:task:manufacture"]
