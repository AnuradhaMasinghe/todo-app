# TODO App Server

This is the backend server for the TODO application built with Node.js, Express.js, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Installation

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Database Setup

1. Install MongoDB.
2. For local MongoDB:
   - Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Start MongoDB service

4. Create a `.env` file in the server directory with:
   ```
   MONGODB_URI=mongodb://localhost:27017/todoapp
   ```

## Running the Server

```
npm start
```

The server will run on http://localhost:3001

## API Endpoints

- GET /api/todos: Retrieve all TODOs
- POST /api/todos: Create a new TODO (body: {title, description})
- PUT /api/todos/:id: Update title/description (body: {title, description})
- PATCH /api/todos/:id/done: Toggle completion status
- DELETE /api/todos/:id: Remove a TODO

## Database Schema

The TODO model uses Mongoose with the following schema:

```javascript
{
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  done: {
    type: Boolean,
    default: false
  }
}
```

Timestamps are automatically added (createdAt, updatedAt).