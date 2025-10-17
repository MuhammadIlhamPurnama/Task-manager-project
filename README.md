# Task Manager Project

A full-stack task management application built with React (Frontend) and Node.js/Express (Backend) with PostgreSQL database.

## Features

-  User Authentication (Login/Register)
-  Dashboard with statistics and top performers
-  Project Management (CRUD with pagination, search, sort, filter)
-  Member Management (CRUD with pagination, search, sort, filter)
-  Task Management with status tracking
-  Task logging system
-  Top members leaderboard based on completed tasks

## Tech Stack
### Frontend
- React 18
- React Router v7
- Axios for HTTP requests
- TailwindCSS for styling
- SweetAlert2 for notifications

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT for authentication
- Bcrypt for password hashing

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Task-manager-project
```

### 2. Backend Setup

Open terminal window 

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `backend` folder:

```env
JWT_SECRET=your_secret_jwt_key_here
```

Replace:
- `username` with your PostgreSQL username
- `password` with your PostgreSQL password
- `database` if task_manager_project already created in your postgreSQL server


## Create database 

```bash
npx sequelize-cli db:create
```

## Migrate table database 

```bash
npx sequelize-cli db:migrate
```

## Seed table users 

```bash
npx sequelize-cli db:seed:all
```

## Jalankan server
```bash
npm start
```

The backend server will run on `http://localhost:3000`

### 3. Frontend Setup

Open a new terminal without closing backend terminal window.

#### Install Dependencies

```bash
cd frontend
npm install
```

#### Start Frontend Development Server

```bash
npm run dev
```

The frontend application will run on `http://localhost:5173`

Ctrl + click the link

User credential : 

email : admin@gmail.com
password admin123