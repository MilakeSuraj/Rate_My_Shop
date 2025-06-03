require("dotenv").config(); // load env variables at the top

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

// Import routers
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const storesRouter = require("./routes/stores");
const ratingsRouter = require("./routes/ratings");

const app = express();

// Use only the cors package as the first middleware
app.use(
  cors({
    origin: "http://localhost:3001", // adjust if your frontend runs on a different port
    credentials: true,
  })
);

// Optionally handle preflight requests for all routes
app.options(
  "*",
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

// Sequelize initialization
const { sequelize } = require("./models");

// Test DB connection and sync models
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("Unable to connect to database:", err));

// Optional: Sync models with database (use carefully in production!)
sequelize
  .sync() // { force: false } by default; true recreates tables
  .then(() => console.log("Models synchronized"))
  .catch((err) => console.error("Failed to sync models:", err));

// Middlewares
app.use(logger("dev"));
app.use(express.json({ limit: "10mb" })); // Increase payload size limit for JSON
app.use(express.urlencoded({ extended: false, limit: "10mb" })); // Increase payload size limit for urlencoded (for base64 images)
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/stores", storesRouter);
app.use("/api/ratings", ratingsRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // respond with error json
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
});

module.exports = app;
