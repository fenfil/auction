# API Server Tests

This directory contains unit and integration tests for the auction API server.

## Running Tests

To run all tests:

```bash
npm test
```

To run tests in watch mode (for development):

```bash
npm run test:watch
```

## Test Structure

The tests are organized as follows:

- `__tests__/services/`: Unit tests for service layer
  - `lot.service.test.ts`: Tests for lot service functionality
  - `bid.service.test.ts`: Tests for bid service functionality

- `__tests__/routes/`: Integration tests for API routes
  - `lots.test.ts`: Tests for lot-related endpoints

- `__tests__/__mocks__/`: Mocks used across tests
  - `prisma.mock.ts`: Mock for the Prisma database service
  - `socket.mock.ts`: Mock for the Socket.IO service

## Test Coverage

Run the tests with the `npm test` command to generate a coverage report. The report will be available in the `coverage/` directory.

## Adding New Tests

When adding new functionality, please follow these patterns:

1. Write unit tests for service methods
2. Write integration tests for API endpoints
3. Use the existing mocks or add new ones as needed

Follow the AAA pattern (Arrange, Act, Assert) when writing tests as demonstrated in the existing test files. 
