const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const dataFile = path.join(__dirname, "data", "tasks.json");

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Task 1: Create a new task
app.post("/api/tasks", (req, res) => {
  const { title, description, priority } = req.body;

  // Validation
  if (!title || !priority) {
    return res.status(400).json({ error: "Title and priority are required" });
  }

  const validPriorities = ["low", "medium", "high", "urgent"];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({ error: "Invalid priority" });
  }

  // Read existing tasks
  let tasks = [];
  if (fs.existsSync(dataFile)) {
    try {
      tasks = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    } catch (err) {
      return res.status(500).json({ error: "Error reading tasks file" });
    }
  }

  // Create new task
  const newTask = {
    taskId: "TASK-" + Date.now(),
    title,
    description: description || "",
    priority,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);

  // Save back to file
  try {
    fs.writeFileSync(dataFile, JSON.stringify(tasks, null, 2));
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Error saving task" });
  }
});

// ✅ Task 2: Get all tasks
app.get("/api/tasks", (req, res) => {
  try {
    if (!fs.existsSync(dataFile)) {
      return res.json([]);
    }
    const tasks = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Error reading tasks" });
  }
});

