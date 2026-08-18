Todo API
Project Overview

This project is a RESTful API for a collaborative To-Do List application. It was developed using Node.js, Express.js, and MongoDB with Mongoose. The API supports creating, retrieving, updating, and deleting tasks.

Technologies Used
Node.js
Express.js
MongoDB
Mongoose
Postman
dotenv
Setup
1. Clone the repository
git clone [(https://github.com/)]
cd todo-api
2. Install dependencies
npm install
3. Configure environment variables

Create a .env file in the project root and add the required database connection and server configuration.

The .env file is excluded from the repository using .gitignore to protect sensitive information.

4. Start the server
npm run dev

The API runs locally at:

http://localhost:4000
API Endpoints
Method	Endpoint	Description
POST	/api/tasks	Create a new task
GET	/api/tasks	Retrieve all tasks
GET	/api/tasks/:id	Retrieve a specific task
PUT/PATCH	/api/tasks/:id	Update a task
DELETE	/api/tasks/:id	Delete a task

The API also supports filtering completed tasks using:

GET /api/tasks?completed=true
Postman Testing

All five required API operations were tested using Postman:

Create Task
Get All Tasks
Get One Task
Update Task
Delete Task

The exported Postman collection is included in the project under the postman folder.

Database

The application uses MongoDB with Mongoose for persistent data storage. Task records include a title, description, completion status, due date, and automatic creation and update timestamps.

Error Handling

The API includes request validation and global error-handling middleware. Invalid requests return appropriate HTTP status codes such as 400 Bad Request and 404 Not Found, while unexpected server errors return 500 Internal Server Error.

GitHub Repository

(https://github.com/)