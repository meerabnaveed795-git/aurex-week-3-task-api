// Model = the shape of a Task document in MongoDB (schema) + tools to work with it
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be low, medium or high",
      },
      default: "medium",
    },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

module.exports = mongoose.model("Task", taskSchema);
