FROM node:16-alpine

WORKDIR /usr/code/services/renderer
COPY ./ /usr/code/services/renderer

RUN npm ci

CMD ["npm", "run", "start:development"]
