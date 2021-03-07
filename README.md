# AZ.dev - The A to Z of software development notes and how-tos

An educational full-stack JavaScript project which uses Node.js, TypeScript, PostgreSQL, GraphQL, React.js, and the Apollo stack.

## AZ.dev apps

A production copy of the project is hosted at [az.dev](https://az.dev).

## Web app development setup

Use the following instructions to run a local development copy of the web app.

### Install dependencies

```
yarn
```

### Start the database server

You'll need [docker compose](https://docs.docker.com/compose/) (which is part of [Docker Desktop](https://www.docker.com/products/docker-desktop)).

Then run:

```
yarn dev:db-server
```

This will download and start a PostgreSQL database container on part 5432 with the sample data loaded in.

If you already have a PostgreSQL database that you'd like to use instead of the Docker container, you'll need to create the database schema for the project using `dev-db/schema.sql`. You can load the sample development data using `dev-db/sample-data.sql`

Using psql:

```
psql -d "postgres://postgres:password@localhost:5432" -c "create database azdev"
psql psql -d "postgres://postgres:password@localhost:5432/azdev" < dev-db/schema.sql
psql psql -d "postgres://postgres:password@localhost:5432/azdev" < dev-db/sample-data.sql
```

### Start the API and web servers

You need to have a .env file in the root:

```
NODE_ENV=development

PORT=1234
GPORT=4321

CONNECTION_STRING=postgres://postgres:password@localhost:5432/azdev
# Change CONNECTION_STRING if you are not using docker

GRAPHQL_SERVER_URL=http://localhost:4321/
GRAPHQL_SUBSCRIPTIONS_URL=ws://localhost:4321/graphql

KEY1=cee70217ebf7ac6610188d78153c34f6b6e47ba0de8e28049b5640bd5d833fd0
KEY2=ad125bdee7e10470ce95ccc5df06faad7822ac60cc50f3659525924109ca6429
KEY3=bcf71a4a21a3dafdb9f09ba5132dfc2bffa193908239cb2fe5068174e5ff6ad2
```

Then run the following commands in 3 different terminals:

```
yarn dev:api-server
yarn dev:web-server
yarn dev:web-bundler
```

Servers URLs:

- API server: http://localhost:4321
- Web server: http://localhost:1234

You can login with the test account using username "test1" and password "123"
