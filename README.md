# Online Auction Application

## Tech Stack

- **Backend**: Express.js, TypeScript, Prisma ORM, PostgreSQL
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Shared**: TypeScript interfaces in a shared package

## Prerequisites

- Node.js (v18 or later)
- npm (v10 or later)
- Docker

## Setup Instructions

### 1. Clone the repository

```bash
git clone git@github.com:fenfil/auction.git
cd auction
```

### 2. Install dependencies

```bash
npm i
```

### 3. Environment variables

Env variables are committed for convenience.

### 4. Setup Database

```bash
docker compose -f docker-compose.dev.yml up -d
```

## Running the Application

### Development Mode

To run both frontend and backend in development mode:

```bash
# From the root directory
npm run dev
```

This will also run migrations for convenience.

### Seed the database with test data

```bash
# From the root directory
npm run seed
```

### Test the application

```bash
# From the root directory
npx turbo test
```

### Run in docker

In case you want to run the application in docker, you can use the following command:

```bash
docker compose up
```

## Postman Collection

A Postman collection is included to help test the API endpoints. The collection includes all API endpoints with example requests.
