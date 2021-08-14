FROM node:16-alpine

ARG FILES_DOMAIN
ENV FILES_DOMAIN $FILES_DOMAIN

WORKDIR /usr/src/code

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build:baseball:presentation && npm run build:task:manufacture

CMD ["npm", "run", "start:api"]
