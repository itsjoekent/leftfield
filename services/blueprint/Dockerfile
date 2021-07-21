FROM node:16-alpine

WORKDIR /usr/code/services/blueprint

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npm", "run", "start:development"]
