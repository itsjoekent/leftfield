# code

Leftfield mono-repo.

## Getting Started

It is recommended to use [Node Version Manager (NVM)](https://github.com/nvm-sh/nvm) and use Node v16 (`nvm install 16 && nvm use 16`) for frontend development.

For backend development, you will need [Docker Desktop](https://www.docker.com/products/docker-desktop) installed.

```sh
# Get values from coworker
$ cp environment/.env.development.api.example environment/.env.development.api

# Create local dev ssl certs (only need to do this once!)
$ npm run ssl:localhost

# Launch frontend apps
$ npm start

# Launch backend services
$ make start-api
```

### Infrastructure Development

Install Terraform,

```sh
$ brew tap hashicorp/tap
$ brew install hashicorp/tap/terraform
$ terraform login
```

### Debugging Local Development

**Running `make start-api` throws `no space left on device` errors**

```sh
$ docker system prune --all --force
```

---

- [ ] ssl/generate-remote (accept domain argument)
  - [ ] generate wildcard
  - [ ] run every 30 days as github action
- [ ] tasks/ssl/cron

- [ ] Refactor/clean up dns menu into sub components
 - [ ] Show DNS cert status

- [ ] image resizing options?
