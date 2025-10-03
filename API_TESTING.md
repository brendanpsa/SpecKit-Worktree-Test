# Task API Testing Guide

## Start the Server

```bash
npm start
```

Server will run on `http://localhost:3000`

## API Endpoints

### 1. Create a Task (POST)

```bash
# Using curl
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API docs",
    "status": "pending",
    "priority": "high"
  }'

# Using HTTPie
http POST localhost:3000/api/tasks \
  title="Complete project documentation" \
  description="Write comprehensive API docs" \
  status=pending \
  priority=high
```

### 2. Get All Tasks (GET)

```bash
# Get all tasks
curl http://localhost:3000/api/tasks

# Filter by status
curl http://localhost:3000/api/tasks?status=pending

# Filter by priority
curl http://localhost:3000/api/tasks?priority=high

# Using HTTPie
http GET localhost:3000/api/tasks
http GET localhost:3000/api/tasks status==pending
```

### 3. Get Single Task (GET)

```bash
# Using curl
curl http://localhost:3000/api/tasks/1

# Using HTTPie
http GET localhost:3000/api/tasks/1
```

### 4. Update Task (PUT)

```bash
# Using curl
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "description": "Updated description"
  }'

# Using HTTPie
http PUT localhost:3000/api/tasks/1 \
  status=in_progress \
  description="Updated description"
```

### 5. Delete Task (DELETE)

```bash
# Using curl
curl -X DELETE http://localhost:3000/api/tasks/1

# Using HTTPie
http DELETE localhost:3000/api/tasks/1
```

## Testing Script

Create a file `test-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000/api/tasks"

echo "Creating tasks..."
curl -X POST $BASE_URL -H "Content-Type: application/json" -d '{"title":"Task 1","priority":"high"}'
curl -X POST $BASE_URL -H "Content-Type: application/json" -d '{"title":"Task 2","status":"in_progress"}'
curl -X POST $BASE_URL -H "Content-Type: application/json" -d '{"title":"Task 3","priority":"low"}'

echo -e "\n\nGetting all tasks..."
curl $BASE_URL

echo -e "\n\nGetting task 1..."
curl $BASE_URL/1

echo -e "\n\nUpdating task 1..."
curl -X PUT $BASE_URL/1 -H "Content-Type: application/json" -d '{"status":"completed"}'

echo -e "\n\nDeleting task 3..."
curl -X DELETE $BASE_URL/3

echo -e "\n\nFinal task list..."
curl $BASE_URL
```

Run with: `chmod +x test-api.sh && ./test-api.sh`

## Expected Response Formats

### Success Responses

**Create Task (201):**
```json
{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive API docs",
  "status": "pending",
  "priority": "high",
  "createdAt": "2025-10-03T15:30:00.000Z",
  "updatedAt": "2025-10-03T15:30:00.000Z"
}
```

**Get Tasks (200):**
```json
[
  {
    "id": 1,
    "title": "Task 1",
    "description": "",
    "status": "pending",
    "priority": "medium",
    "createdAt": "2025-10-03T15:30:00.000Z",
    "updatedAt": "2025-10-03T15:30:00.000Z"
  }
]
```

### Error Responses

**404 Not Found:**
```json
{
  "error": "Task not found"
}
```

**400 Bad Request:**
```json
{
  "error": "Title is required"
}
```

**400 Validation Error:**
```json
{
  "errors": [
    "Title must be 200 characters or less",
    "Status must be one of: pending, in_progress, completed"
  ]
}
```
