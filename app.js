const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files (your frontend)
app.use(express.static(path.join(__dirname, 'todo-frontend')));

// In-memory storage for tasks
let tasks = [];

// GET all tasks
app.get('/todos', (req, res) => {
  res.status(200).json(tasks);
});

// POST a new task
app.post('/todos', (req, res) => {
  const { title, description, reminderDatetime } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    description: description || '',
    completed: false,
    reminderDatetime: reminderDatetime || null, // ✅ Add support for reminder datetime
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT to toggle task completion
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const task = tasks.find((t) => t.id === parseInt(id));

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  task.completed = !task.completed;
  res.status(200).json(task);
});

// DELETE a task
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === parseInt(id));

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(200).json({ message: 'Task deleted' });
});

// Start the server
app.listen(port, () => {
  console.log(`✅ Todo API running at http://localhost:${port}`);
});
