# Task Management API Specification

## Overview
Build a RESTful CRUD API for task management using Express.js.

## Requirements

### Data Model
A task should have:
- `id`: Unique identifier (auto-generated)
- `title`: String (required, max 200 chars)
- `description`: String (optional, max 1000 chars)
- `status`: Enum (pending, in_progress, completed)
- `priority`: Enum (low, medium, high)
- `createdAt`: Timestamp (auto-generated)
- `updatedAt`: Timestamp (auto-updated)

### API Endpoints

#### Create Task
- **POST** `/api/tasks`
- Request body: `{ title, description?, status?, priority? }`
- Response: Created task object with 201 status

#### Get All Tasks
- **GET** `/api/tasks`
- Query params: `status`, `priority` (optional filters)
- Response: Array of task objects

#### Get Single Task
- **GET** `/api/tasks/:id`
- Response: Task object or 404 if not found

#### Update Task
- **PUT** `/api/tasks/:id`
- Request body: `{ title?, description?, status?, priority? }`
- Response: Updated task object or 404 if not found

#### Delete Task
- **DELETE** `/api/tasks/:id`
- Response: 204 No Content or 404 if not found

### Technical Requirements
- Use Express.js 4.x
- In-memory storage (array) for simplicity
- Proper HTTP status codes
- Input validation
- Error handling middleware
- JSON response format
