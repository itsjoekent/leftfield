# code

Leftfield mono-repo.

## Getting Started

It is recommended to use [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm) and use Node v16 (`nvm install 16 && nvm use 16`) for frontend development.

For backend development, you will need [Docker Desktop](https://www.docker.com/products/docker-desktop) installed.

```sh
# Get values from coworker
$ cp environment/.env.development.api.example

# Create local dev ssl certs (only need to do this once!)
$ npm run ssl:localhost

# Launch frontend apps
$ npm start

# Launch backend services
$ make start-api
```

### Debugging Local Development

**Running `make start-api` throws `no space left on device` errors**

```sh
$ docker system prune --all --force
```

---

- [ ] API task to get certificate when new domain is added https://github.com/publishlab/node-acme-client
- [ ] (On prod) Read getleftfield cert from S3 bucket
- [ ] Refactor/clean up dns menu into sub components
 - [ ] Show DNS cert status

- [ ] image resizing options?

- [ ] Delete CF + DO resources, downgrade plans

---

- Object versioning
- Replication rules
- CORS
