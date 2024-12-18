# Admin Dashboard Server


This repository contains the backend of the Admin Dashboard project, built using TypeScript and Express.js to support robust API endpoints for data visualization and management. The frontend, developed with ReactJS, Material-UI, and TypeScript, seamlessly integrates with this backend to provide a powerful admin interface.

### Features


- RESTful API endpoints for data management.

- MongoDB integration for secure and efficient data storage.

- Modular architecture for controllers, routes, and models.

- Comprehensive support for data visualization tasks.
- Automated tests for key functionalities.

### Tech Stack

- Backend Framework: Express.js

- Database: MongoDB

- Language: JavaScript

- Testing Framework: Jest

- Other Tools: Mongoose (ODM)

### Getting Started

### Prerequisites

Ensure you have the following installed:

Node.js
MongoDB

### Installation
1. Clone the repository:
git clone https://github.com/mnrx2020/admin_dashboard_server.git
cd admin_dashboard_server

2. Install dependencies:
npm install

3. Create a .env file in the root directory and specify the following variables:
PORT=5000
MONGO_URI=<Your MongoDB connection string>

4. Start the server:
npm start

The server will run on http://localhost:5000 by default.

### Running Tests
Automated tests are available to validate the server's functionality. To run the tests, execute:

npm test

Ensure the test database is configured in your .env file to avoid overwriting production data.

### API Endpoints

The following endpoints are available for interacting with the backend:

| Method | Endpoint         | Description           |
|--------|------------------|-----------------------|
| GET    | `/api/data`      | Fetches data          |
| POST   | `/api/data`      | Adds new data         |
| PUT    | `/api/data/:id`  | Updates specific data |
| DELETE | `/api/data/:id`  | Deletes specific data |


### Folder Structure

The project is organized as follows:



data-visualization-server/ ├── controllers/ # Contains the business logic for API endpoints ├── models/ # Mongoose schemas and database models ├── routes/ # Defines API routes for handling HTTP requests ├── tests/ # Automated test cases for backend functionalities ├── utils/ # Utility functions used throughout the project ├── data/ # Sample data or seed files ├── config/ # Configuration files (e.g., database or environment settings) ├── .env # Environment variables file (not included in version control) ├── .gitignore # Lists files and directories to be ignored by Git ├── index.js # Entry point of the application └── package.json # Contains project metadata and dependencies


### Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

