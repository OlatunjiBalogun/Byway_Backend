# Byway Backend 

## Description
This is a Node.js application that provides authentication features using Express and MongoDB.

## Installation
To set up the project locally, follow these steps:
1. Clone the repository.
2. Run `npm install` to install the dependencies.
3. Create a `.env` file and add your MongoDB connection URL and JWT secret.

## Usage
To run the application, use the command:
```
node index.js
```
The server will start on the specified port.

## API Endpoints
- **POST /api/auth/signup**: Register a new user.
- **POST /api/auth/login**: Log in an existing user.

## File Descriptions
- `index.js`: Entry point of the application.
- `package.json` and `package-lock.json`: Dependency management.
- `auth/`: Contains authentication logic (routes, controllers, validators).
- `middlewares/`: Contains middleware functions, including error handling.
- `models/`: Contains data models for MongoDB.
