FROM node:16-alpine

WORKDIR /usr/src/code

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build:baseball:presentation && npm run build:task:manufacture:local

CMD ["npm", "run", "start:task:manufacture:development"]
