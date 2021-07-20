FROM node:16-alpine

WORKDIR /usr/code/api/renderer
COPY ./ /usr/code/api/renderer

RUN npm ci

CMD ["npm", "run", "start:development"]
