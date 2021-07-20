# Editor (app.editor)

This project is the core website editor.

**Local development**: `https://localhost:5000`
**Staging**: `https://staging.leftfield.com/editor`
**Production**: `https://leftfield.com/editor`

## Local Development

First, run `make build`. If you install new packages or make changes outside the `src` directory, you'll need to run this again.

Use `make staging` if you just need to make frontend changes and want to use the staging infrastructure as a backend.

If you need the editor to talk to a local backend, use `make local`.

## Testing

- `npm test`: Run all tests.
- `npm run test:integration`: Run [Cypress](https://www.cypress.io/) integration tests.
- `npm run test:unit`: Run [Jest](https://jestjs.io/) unit tests.
