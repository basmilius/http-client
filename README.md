# Http Client

This repository contains the source code for the Http client that I use in personal Vue
projects. It requires you to create dto's for objects and services for api calls.

## 📦 Registry

- The package is available under `@basmilius/http-client`.

## ⚠️ Requirements

- Install Node.js ^22
- Install pnpm using `npm i -g pnpm`.
- Use `pnpm install` to install the required packages.
- Use `pnpm dev` to start a build watcher for both targets.
- Use `pnpm build` to build a production bundle.

## 🪵 Git

All commit messages and branches will be in English.

### Branches

- **Main** — Contains the latest stable release and is the exact source that is running in production.
- **Develop** — Contains the latest staging release that is marked for deployment and is the exact source that is running on staging.
- **Feature branches** — Any feature should have its own feature branch. Once complete, the branch should be merged into the _develop_ branch and the feature branch should be deleted.
- **Bugfix branches** — When a bug is found, it should be fixed within a bugfix branch. Once complete the branch should be merged into the _develop_ branch and the feature branch should be deleted.

### Commit messages

Commit messages are bound to the following templates:

- `<type>: <message> `
- `<type>(<feature>): <message>`
- `<type>(<feature>): <message> [<issue-number>]`

#### Examples

- `feat(dto): adds clone function to clone dtos.`
- `feat(http): implement put requests. [HTTP-123]`
- `chore: applied default coding style.`
