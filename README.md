# code

Leftfield mono-repo.

## Getting Started

You'll need [Docker Desktop](https://www.docker.com/) to run the projects in this repository.

To run an application (`.app`) or api (`.api`) project locally, you can `cd ${directory}` into the directory and run one of the following commands,

 - `make local`: Connect to other projects running locally
 - `make staging`: Connect to staging resources

To work on a package (`.pkg`) project locally, `cd ${directory}` into the directory and run `make start`.

All projects afford `make test`.

## Project naming structure

`${type}.${name}`

**Project Type Abbreviations**:

- `api`: Backend API
- `app`: Frontend static website
- `pkg`: Re-usable library

## Deployment

## Preferred Technologies
