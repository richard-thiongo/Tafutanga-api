# Tafutanga API - Backend

This document contains the backend Node.js API structure for Tafutanga, which helps Kenyans in Nairobi make house hunting easier. The backend is built with Node.js and Express, following a modular architecture separating configurations, middleware, and domain modules.

## File & Folder Structure

This section explains what each folder represents and the purpose of every file within it.

### `src/index.js`
- **`index.js`**: The main entry point for the backend server. It sets up the Express application, applies global middleware, mounts the API routes, and starts the server.

---

### `src/config/`
Contains configurations for external services, database connections, and infrastructure.
- **`cloudinary.js`**: Configuration and setup for the Cloudinary service, which is used for handling and storing image uploads.
- **`database.js`**: Configuration and connection setup for the application's database, establishing the link for data persistence.

---

### `src/middleware/`
Contains reusable Express middleware functions used across various routes to intercept and process incoming requests.
- **`auth.js`**: Authentication middleware used to verify JWT tokens and secure protected routes (ensuring only authenticated users/landlords can access them).
- **`errorHandler.js`**: Centralized error-handling middleware that catches application errors, formats them, and returns consistent API error responses to the client.
- **`rateLimiter.js`**: Middleware to limit the rate of incoming API requests from a single IP address, helping to prevent abuse and DDoS attacks.
- **`upload.js`**: Middleware to process multipart/form-data and handle file uploads (e.g., property images) from incoming requests.

---

### `src/modules/`
Contains the core business logic of the application, divided by feature domains. Each domain contains its own controllers, repositories, routes, and services.

#### `src/modules/auth/`
Handles user authentication, registration, and session management for landlords.
- **`auth.controller.js`**: Receives incoming HTTP requests, extracts necessary data, calls the auth service, and formats HTTP responses.
- **`auth.repository.js`**: Responsible for direct interactions with the database for user and authentication records.
- **`auth.routes.js`**: Defines the specific API endpoint URLs (e.g., `/login`, `/register`) and maps them to their respective controller functions.
- **`auth.service.js`**: Contains the core business rules and logic for authentication, such as hashing passwords, validating credentials, and generating JWTs.

#### `src/modules/properties/`
Handles the management of physical properties, including units, specific rooms, and public listings.
- **`properties.controller.js`**: Receives incoming HTTP requests related to creating, reading, updating, and deleting properties/rooms.
- **`properties.repository.js`**: Responsible for executing database queries and operations relating to properties, units, and room listings.
- **`properties.routes.js`**: Defines the API endpoint URLs for properties and maps them to controller functions.
- **`properties.service.js`**: Contains the core business logic for property management, including data validation, formatting, and coordinating between different property records.

---

## Heartbeat Endpoint

A heartbeat is a periodic signal sent by the system to show that it's still running and healthy. You can check the health of the Tafutanga API at any time by making a GET request to the `/heartbeat` endpoint:
- **`GET /heartbeat`**: Returns a JSON object with `status: "ok"` and a current timestamp to confirm the server is operational.

---

## Running Locally

1. Open a terminal in the `tafutanga-api` directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
