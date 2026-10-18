// Controller = the logic for each route (what happens when a request arrives)
const mongoose = require("mongoose");
const Task = require("../models/Task");

// Only these fields are accepted from the client (ignores anything else)
const ALLOWED_FIELDS = ["title", "description", "completed", "priority"];

const pickAllowed = (body) => {
  const data = {};
  const source = body || {};
  ALLOWED_FIELDS.forEach((field) => {
    if (source[field] !== undefined) data[field] = source[field];
  });
  return data;
};

const isValidId = (id) => mongoose.isValidObjectId(id);

// CREATE  ->  POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const task = await Task.create(pickAllowed(req.body));
    res.status(201).json(task); // 201 = Created
  } catch (error) {
    next(error); // sends the error to the error handler middleware
  }
};

// READ ALL  ->  GET /api/tasks   (optional: /api/tasks?completed=true)
const getTasks = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === "true";
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 }); // newest first
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// READ ONE  ->  GET /api/tasks/:id
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// UPDATE  ->  PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const updates = pickAllowed(req.body);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Send at least one field to update" });
    }

    const task = await Task.findByIdAndUpdate(id, updates, {
      returnDocument: "after", // return the updated task, not the old one
      runValidators: true, // run the schema rules on updates too
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// DELETE  ->  DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully", id });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getTasks, getTaskById, updateTask, deleteTask };
