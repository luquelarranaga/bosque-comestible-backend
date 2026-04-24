# Bosque Comestible API

A RESTful backend API for a plants log, built with Node.js and Express. It allows users to browse, post, delete and update details of one's plants, as well as filter by species. These are served as JSON.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Tech Stack](#tech-stack)

---

## Getting Started

Follow the steps below to get a local copy of the project up and running.

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher recommended)

---

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/luquelarranaga/bosque-comestible-backend.git
cd bosque-comestible-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root of the project and add your database connection details:

```
PGDATABASE=your_database_name
```

4. **Set up and seed the database**

```bash
npm run setup-dbs
npm run seed
```

---

## Running the Server

To start the server in development mode:

```bash
npm start
```

The API will be available at `http://localhost:9090/api` by default.

---

## API Endpoints

All endpoints are prefixed with `/api`. Full interactive documentation is available in `index.html`.

### Plants

| Method | Endpoint                             | Description                                                             |
| ------ | ------------------------------------ | ----------------------------------------------------------------------- |
| GET    | `/api/plants`                      | Get all plants, ordered by species and date planted. Supports `species` query params.  |
| POST | `/api/plants` | Add a new plant to your plant log |
| GET    | `/api/plants/:plant_id`          | Get a single plant by ID                                              |
| PATCH  | `/api/plants/:plant_id`          | Update details of your plant                                        |
| DELETE    | `/api/plants/:plant_id` | Delete your plant                                        |

#### Query Parameters for `GET /api/plants`
Parameter `species` only accepts species that already exist in your plant database. Invalid characters such as numerical digits or non-word characters (e.g. "*!?<") will result in a 400 error. 

### Images Entries

| Method | Endpoint                             | Description                                                             |
| ------ | ------------------------------------ | ----------------------------------------------------------------------- |
| PATCH  | `/api/images/:image_id`          | Replace images with new urls or amend when image was taken                                       |
| DELETE    | `/api/images/:image_id` | Delete image                                      |


### Logs Entries

| Method | Endpoint                             | Description                                                             |
| ------ | ------------------------------------ | ----------------------------------------------------------------------- |
| PATCH  | `/api/logs/:log_id`          | Update body of a log entry                                      |
| DELETE    | `/api/logs/:log_id` | Delete a log entry  

---

## Error Handling

The API returns consistent error responses in the following format:

```json
{ "msg": "Description of the error" }
```

| Status Code | Meaning                                                              |
| ----------- | -------------------------------------------------------------------- |
| `400`       | Bad Request — invalid input, malformed ID, or incorrect request body |
| `404`       | Not Found — resource does not exist                                  |
| `405`       | Method Not Allowed — HTTP method not supported on this endpoint      |
| `500`       | Internal Server Error                                                |

---

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Express
- **Database** — PostgreSQL
- **CORS** — enabled via the `cors` package
