const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// In-memory task storage
let tasks = [];
let nextId = 1;

// Helper function to find task by ID
const findTaskById = (id) => tasks.find(task => task.id === parseInt(id));

// Helper function to validate task data
const validateTask = (data) => {
  const errors = [];

  if (data.title && data.title.length > 200) {
    errors.push('Title must be 200 characters or less');
  }

  if (data.description && data.description.length > 1000) {
    errors.push('Description must be 1000 characters or less');
  }

  if (data.status && !['pending', 'in_progress', 'completed'].includes(data.status)) {
    errors.push('Status must be one of: pending, in_progress, completed');
  }

  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('Priority must be one of: low, medium, high');
  }

  return errors;
};

// CREATE - POST /api/tasks
app.post('/api/tasks', (req, res) => {
  const { title, description, status, priority } = req.body;

  // Validation
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const validationErrors = validateTask(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const newTask = {
    id: nextId++,
    title,
    description: description || '',
    status: status || 'pending',
    priority: priority || 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// READ ALL - GET /api/tasks
app.get('/api/tasks', (req, res) => {
  const { status, priority } = req.query;

  let filteredTasks = tasks;

  if (status) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }

  if (priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === priority);
  }

  res.json(filteredTasks);
});

// READ ONE - GET /api/tasks/:id
app.get('/api/tasks/:id', (req, res) => {
  const task = findTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

// UPDATE - PUT /api/tasks/:id
app.put('/api/tasks/:id', (req, res) => {
  const task = findTaskById(req.params.id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const validationErrors = validateTask(req.body);
  if (validationErrors.length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  const { title, description, status, priority } = req.body;

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  if (priority !== undefined) task.priority = priority;
  task.updatedAt = new Date().toISOString();

  res.json(task);
});

// DELETE - DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req, res) => {
  const taskIndex = tasks.findIndex(task => task.id === parseInt(req.params.id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Task API server running on port ${PORT}`);
});

module.exports = app;
