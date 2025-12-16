# Wallet Service

A simple wallet system built with **NestJS**, **TypeORM**, and **PostgreSQL**.

---

## Features

* Create wallets
* Fund wallets
* Transfer funds between wallets
* Transaction history
* Unit tests with in-memory database

---

## Tech Stack

* Node.js
* NestJS
* TypeORM
* PostgreSQL (Production)
* SQLite (Tests)
* Jest

---

## Prerequisites

* Node.js >= 18
* npm
* PostgreSQL (for local/prod)

---

## Installation

```bash
npm install
```

---

## Environment Variables

Create a `.env` file:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nova_db
DB_USER=postgres
DB_PASSWORD=123456
DB_SYNC=true
```

---

## Running the App

### Development

```bash
npm run start:dev
```

### Production Build

```bash
npm run build
npm run start:prod
```

---

## Running Tests

```bash
npm run test
```

Tests use an **in-memory SQLite database**, so PostgreSQL is not required for testing.


## Notes

* Balance consistency is enforced in the service layer.
* Designed to be easily extended with Redis, idempotency, and distributed locks.

---

## Postman Collection
[nova_postman Collection](https://lettube.postman.co/workspace/lettube~6b31ffc5-af0f-4d56-a949-1c56745d226c/collection/36396778-9c54d2b9-0193-4752-aa4d-6e0a1be1d176?action=share&creator=36396778&active-environment=36396778-e2f200db-370a-4026-9be1-dc2ed2566215)


## Author

Isaiah Daniel
