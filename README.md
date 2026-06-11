# TaskDuty — Task Manager App

A full-stack task management web application built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. TaskDuty allows users to create, view, update, and delete tasks with category tagging, due date tracking, and completion status management.



## Features

- Create tasks with a title, description, due date, and category (Work / Personal / Urgent)
- View all tasks in a clean card-based layout
- Edit any task's details or mark it as completed
- Delete tasks with confirmation prompt
- Category colour coding — Urgent (red), Personal (teal), Work (purple)
- Toast notifications for all CRUD actions
- Form validation — all fields required, due date cannot be in the past
- Loading skeleton cards while fetching data
- 404 error page for unmatched routes

---

## Tech Stack

### Frontend
| Technology | Version |
|---|---|
| React | 19 |
| TypeScript | 5 |
| Vite | 6 |
| Tailwind CSS | 4 |
| React Router DOM | 7 |
| Axios | 1.7 |
| React Toastify | 11 |

### Backend
| Technology | Version |
|---|---|
| Node.js | 22 |
| Express | 5 |
| TypeScript | 5 |
| MongoDB | Atlas |
| Mongoose | 9 |



## Project Structure

```
taskduty/                        # Frontend
├── src/
│   ├── api/
│   │   └── axios.ts             # Axios instance with base URL config
│   ├── assets/                  # SVG and PNG assets
│   ├── components/
│   │   ├── NavBar.tsx           # Fixed navigation bar
│   │   └── SkeletonCard.tsx     # Loading placeholder cards
│   ├── context/
│   │   └── TasksContext.tsx     # Global state + all CRUD logic
│   ├── layout/
│   │   └── Layout.tsx           # Route wrapper
│   ├── pages/
│   │   ├── CoverPage.tsx        # Landing / hero page
│   │   ├── AllTasks.tsx         # Task list with edit and delete
│   │   ├── NewTask.tsx          # Create task form
│   │   ├── EditPage.tsx         # Edit task form
│   │   └── Error.tsx            # 404 page
│   ├── types/
│   │   └── task.ts              # TypeScript interfaces
│   ├── App.tsx                  # Routes definition
│   └── main.tsx                 # Entry point
└── .env                         # VITE_API_URL

taskduty-back/                   # Backend
├── src/
│   ├── config/
│   │   └── db.ts                # MongoDB connection
│   ├── controllers/
│   │   └── TaskController.ts    # CRUD handlers
│   ├── models/
│   │   └── TaskModel.ts         # Mongoose schema
│   ├── routes/
│   │   └── TaskRoutes.ts        # Express routes
│   └── server.ts                # Entry point
└── .env                         # MONGO_URI, PORT, FRONTEND_URL
```

---

## API Endpoints

Base URL: `https://taskduty-back.onrender.com/api`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

### Task Object

```json
{
  "_id": "664abc123...",
  "title": "Finish project report",
  "description": "Write and submit the Q2 report",
  "dueDate": "2025-08-01T00:00:00.000Z",
  "category": "Work",
  "completed": false,
  "createdAt": "2025-07-01T10:00:00.000Z",
  "updatedAt": "2025-07-01T10:00:00.000Z"
}
```

Category must be one of: `Work` | `Personal` | `Urgent`

---



## Author

Built by **Wale** as part of a full-stack development assessment.
