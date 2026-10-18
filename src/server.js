// Entry point: creates the Express app, connects to MongoDB and starts the server
require("dotenv").config({ quiet: true }); // quiet: hides dotenv's extra log message

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// ----- Middleware (runs for every request, in this order) -----
app.use(cors()); // lets a React frontend call this API
app.use(express.json()); // reads JSON from the request body into req.body

// ----- Routes -----
app.get("/", (req, res) => {
  res.json({ message: "Task API is running" });
});
app.use("/api/tasks", taskRoutes);

// ----- Error handling (must come after the routes) -----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start the server only after the database is connected
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
