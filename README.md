# 🧠 Whiteboard API

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-grey?logo=testing-library&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A simple and efficient backend API for a collaborative whiteboard app, built with **Node.js**, **Express**, and **MongoDB**. Includes comprehensive unit and integration testing using **Vitest** and **Supertest**.

---

## 🚀 Features

- 📄 **Create** whiteboards with a title and creator name
- 🔍 **Retrieve** a whiteboard by its ID
- ❌ **Delete** a whiteboard by ID
- 🧪 Tested routes using **Supertest** and **Vitest**
- 🧱 Clean, modular code with `app.js`, `models`, and `routes` structure
- 🔐 Ready for integration with authentication (e.g. JWT)

---

## 🧪 Test Coverage

The API has been tested using:

- `Vitest` for test runner
- `Supertest` for simulating HTTP requests
- `Mongoose` uses separate **test database** to avoid messikng with live data.

```bash
npm test

## Technologies Used

- **Express.js** — Backend framework for handling routes and middleware
- **MongoDB & Mongoose** — Database and ORM for storing whiteboard data and users
- **Vite** — (Frontend-ready) Build tool for fast front-end development
- **Vitest** — Unit testing framework for JavaScript & TypeScript
- **Supertest** — HTTP assertions for API endpoint testing
- **bcrypt** — Password hashing
- **dotenv** — Environment variable management

## API Endpoints

### User Routes (`/api/users`)

- `POST /register` — Register a new user
- `POST /login` — Authenticate user and return JWT
- `PUT /update-password` — Update user password (requires valid JWT)
- `DELETE /delete-account/:id` — Delete a user by ID

### Whiteboard Routes (`/api/whiteboard`)

- `POST /` — Create a new whiteboard
- `GET /:id` — Get a whiteboard by ID
- `DELETE /:id` — Delete a whiteboard by ID

## Test Coverage

✅ User route tests for:
- Registration
- Login
- Password update
- User deletion

✅ Whiteboard route tests for:
- Creating a whiteboard
- Fetching by ID
- Deletion

## Getting Started

```bash
# Clone the repository
git clone https://github.com/jassakoch/whiteboard

# Navigate into the project directory
cd whiteboard-backend

# Install dependencies
npm install

# Start the development server
npm run dev
