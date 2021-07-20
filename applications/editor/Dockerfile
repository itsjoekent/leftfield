FROM node:16-alpine

WORKDIR /usr/code/applications/editor
COPY ./ /usr/code/applications/editor

RUN npm ci

CMD ["npm", "run", "start:development"]
