const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config(); //check env file: port value
const port = process.env.PORT || 5000;

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connectDB();
connectDB()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log(`Database connection failed: ${err.message}`);
  });

app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});
app.use("/api", require("./routes/router"));

app.listen(
  port,
  () =>
    `Server is running on the port ${port}!
-------------------------------------------------------------------------`
);
