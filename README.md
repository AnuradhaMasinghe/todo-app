# TODO App

A full-stack TODO application with React frontend and Node.js/Express backend with MongoDB.

## Project Structure

- `client/` - React frontend built with Vite
- `server/` - Node.js/Express backend with MongoDB

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

## Installation

1. Clone or download the project
2. Run `npm install` in the root directory to install all dependencies
3. Set up the database (see server README)
4. Start the servers

## Running the Application

### Development Mode

Run both client and server concurrently:

```
npm run dev
```

This will start:
- Backend server on http://localhost:3001
- Frontend client on http://localhost:5173

### Manual Start

Start the backend:
```
cd server && npm start
```

Start the frontend:
```
cd client && npm run dev
```

## Features

-  View all TODOs
-  Create new TODOs
-  Edit TODOs (title/description)
-  Mark as done/undone
-  Delete TODOs
-  RESTful API
-  MongoDB persistence
-  Form validation
-  Error handling

## Tech Stack

- **Frontend**: React.js, Vite, Axios
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB

## API Endpoints

See server/README.md for detailed API documentation.