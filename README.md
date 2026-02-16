# **Bondsports API assignemnt**

This repository contains an implementation of the provided assignment.

## Runtime layout

- Fastify (HTTP server)
- Typescript 
- PostgreSQL (w/ `pg` driver)
- Vitest (for unit tests)

## Setup

```bash
npm install

docker compose up -d # spin up pg container

./scripts/init/seed-db.sh # to create tables and seed with mock data

npm run build
npm start

# alternatively, for process watchers
npm run dev
```

## Design & Architecture

I architected this web-server (mostly) with the understandings I gained in the book "Clean Architecture" By Uncle Bob, completed with my own interpertation of best practices.

Different layers of the web-server are separate: 

- **Business Logic**: Consists of entities, their corresponding methods and business rules they enforce.

- **Driver**: The HTTP server itself, it's corresponding request handlers and api structure, endpoints, etc.

- **Data Persistence**: e.g. a postgresql interface which exposes basic methods such as create(), list()

- **Adapters**: Consists of entity gateways (expose methods between entities and data persistence layer), and mappers. in short a layer responsible for flexible adaptation between layers

## Testing
```bash
npm test # to run unit tests

# to run various cURL requests on dummy account
./scripts/deposit.sh [amount]
./scripts/withdraw.sh [amount]
./scripts/statement.sh
./scripts/statement-with-filters.sh
./scripts/create-account.sh
```

## Design changes

The provided document specifies entity parameters. 

I have different layers of obejects: PG row -> Business Entity -> API Entity.

I made some minor changes in the entity specification for convinience and ease-of-use.

- `accountId` in Account is changed to just `id`, same with other entitites. (term. repetition)
- `createdAt` in Account is changed to `creationTimestamp` (better terminology IMO)

- `value` in Transaction is changed to `amount` (to signify a numeral)
- `transactionDate` in Transaction is changed to `createdAt` (term. repetition)


## TODO
- [DONE] Add 'use case' interface and implementation to handle more complex business login between entities in the app folder. I've skipped this because of time constraints (and server architecture became too bloated for such a small project)

- [DONE] Add and interact with a DB connection pool instead of a single connection.

- Add in-memory data persistence for ease-of-use and e2e testing.

- [DONE] The act of deposit and withdraw has two side effects, changing `account` balance and creating a seperate transaction row in the DB. each act should be atomic, this requires to implement an interface for transactions which I haven't had the time to do.

- discuss the possibility to remove the field `balance` in accounts, implement some type of event sourcing and calculating an account's balance based on addition of transaction history on any given request. 

- `accountType` field in `account` is not used at all, understand it's purpose and uses. in addition add some kind of enum to map account types. if this config dynamic, add a table to keep track of different account types and their corresponding codes

- monetary values are stored as `INT` in DB. understand system constraints and edge cases, it might need to be a bigger variable such as `BIGINT`

- fields regarding money numerals should be counted in cents, this should be persistent throughout the API and any client should be aware of this design choice.

- Security risk - I inject some variables in PG interface, this adds risk for SQL Injection. there's a better way to do this.