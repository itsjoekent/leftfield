# code

Leftfield mono-repo.

## Getting Started

It is recommended to use [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm) and use Node v16 (`nvm install 16 && nvm use 16`).

For API development, you will need [Docker Desktop](https://www.docker.com/products/docker-desktop) installed. You'll also need to fill out `environment/.env.development.api` and run `npm run api:ssl`.

```sh
# Launch frontend apps
# NOTE: The first time you launch this, you will be prompted for your system password,
# this is to automatically generate an SSL cert on your machine for localhost
$ npm start

# Launch api
$ make start-api
```

docker container ls
docker exec -t -i e6fdaea1eee7 npm run upload:baseball:presentation
