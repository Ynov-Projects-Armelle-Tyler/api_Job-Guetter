<div align="center">

# Job Guetter API

</div>

## Installation

### Pre-requisites

- [Node](https://nodejs.org/en/download/package-manager/) >= 12
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable) >= 1
- [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

### Install dependencies

```bash
yarn install
```

### Configure local environment

```bash
# /etc/hosts
# add this line
127.0.0.1 api.job-guetter.develop
```



## Usage

Run all services:

```bash
yarn serve
```

Or run only some services:

```bash
yarn serve general
```

API should now be available at `https://api.job-guetter.develop:8443/api/v1`.

### Available services

- `general` -> everything for the moment

## Tools

### `yarn lint`

Run & watch if your code are clean.

Example:

```bash
yarn lint
```

### `yarn list-services`

List all the available services.

Example:

```bash
yarn list-services
```

#### Options

##### --json

Output list as a json array

Example:

```bash
yarn list-services --json
```

### `yarn serve <service...>`

Run & watch for changes one or more services on a local dev server.

Example:

```bash
yarn serve general
```
