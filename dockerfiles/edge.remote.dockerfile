FROM node:16-alpine

WORKDIR /usr/src/code

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "start:edge"]
