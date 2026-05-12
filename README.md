# Book API (Node.js + Express + MongoDB)

Simple REST API for creating and querying books, built with Express and Mongoose.

## Requirements

- Node.js (any reasonably modern version should work)
- MongoDB running locally on `mongodb://localhost:27017`

The app connects to:

- `bookAPI` (default)
- `bookAPI_Test` (when `ENV=Test`)

## Install

```bash
npm install
```

## Run

Starts the server with nodemon:

```bash
npm start
```

By default the app listens on `PORT` or `3000`. This repo’s `nodemonConfig` sets `PORT=4000`, so you will typically have it on:

`http://localhost:4000`

Root endpoint:

- `GET /` -> `Welcome tomy API =D!`

API base path:

- `/api`

## Docker (API + MongoDB)

This repo includes `docker-compose.yml` to run the API and MongoDB together.

```bash
docker compose up --build
```

API will be available at:

`http://localhost:4000`

MongoDB will be exposed at:

`mongodb://localhost:27017`

## Environment Variables

- `PORT`: Server port (default: `3000`)
- `ENV`: When set to `Test`, the app uses the `bookAPI_Test` database (used by integration tests)
- `MONGO_URL`: Mongo connection string (overrides the default localhost connection). Used by Docker Compose.

Example:

```bash
ENV=Test PORT=3001 node app.js
```

## Endpoints

All endpoints below are prefixed with `/api`.

### `POST /books`

Creates a new book.

Body:

```json
{
  "title": "My Book",
  "author": "Jon",
  "genre": "Fiction",
  "read": false
}
```

Notes:

- `title` is required; otherwise the API returns `400` with `Title is required`.
- `read` defaults to `false` in the schema.

Example:

```bash
curl -X POST http://localhost:4000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"My Book","author":"Jon","genre":"Fiction"}'
```

### `GET /books`

Returns all books. You can also pass query-string filters; they are forwarded directly to `Book.find(query)`.

Example (filter by genre):

```bash
curl "http://localhost:4000/api/books?genre=Fiction"
```

Each returned book includes a `links.self` field pointing to its own resource URL.

### `GET /books/:bookId`

Returns a single book by id. Also returns a `links.FilterByThisGenre` URL.

```bash
curl http://localhost:4000/api/books/<bookId>
```

### `PUT /books/:bookId`

Replaces the book fields (`title`, `author`, `genre`, `read`).

### `PATCH /books/:bookId`

Partially updates a book. If `_id` is provided in the payload, it is ignored.

### `DELETE /books/:bookId`

Deletes a book. Returns `204` on success.

## Scripts

```bash
npm test
npm run lint
```

Tests include integration tests that set `ENV=Test` and will use the `bookAPI_Test` database. You need:

- MongoDB running on `localhost:27017`
- A free TCP port for the app to listen on (defaults to `3000`, but you can override it)

Example:

```bash
ENV=Test PORT=3001 npm test
```
