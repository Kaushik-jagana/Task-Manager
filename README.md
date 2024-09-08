# Task Manager Application

This is a Task Manager web application similar to Trello, allowing users to create, update, and manage tasks within columns. Users can sign up, log in, and manage tasks with drag-and-drop functionality. The application supports Google OAuth for user authentication.

## Features

- User registration and login (local and Google OAuth)
- Task management with drag-and-drop functionality
- Column-based task management (TODO, IN-PROGRESS, DONE)
- Create, edit, delete, and view task details
- Responsive design for mobile and desktop
- Persistent user sessions with JWT authentication
- User profile, task due dates, sorting, and search functionalities

## Tech Stack

### Frontend:
- React
- React Beautiful DnD (Drag and Drop)
- Axios for HTTP requests
- React Router for navigation

### Backend:
- Node.js
- Express
- MongoDB (Mongoose)
- Passport.js for Google OAuth
- JWT for authentication


## Steps followed to setup the project

### Setting up server and database

1. Clone the repository :

```(bash)
   git clone https://github.com/your-username/Pokemon.git
   cd Pokemon
```

2. Setup backend configuration.Create a .env file in backend :

```(JSON)
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/task-manager?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
```

3. Install backend dependencies and start the server
   
```(bash)
   cd backend
   npm install
   npm start
```
   
4. Install frontned dependencies and start the server
   
```(bash)
   cd ../frontend
   npm install
   npm start
``` 



