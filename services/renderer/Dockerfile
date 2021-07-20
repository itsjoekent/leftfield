FROM node:16-alpine

WORKDIR /usr/code/services/renderer

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "start:development"]
