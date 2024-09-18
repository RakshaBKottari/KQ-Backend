const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config(); //check env file: port value
const port = process.env.PORT || 5000;

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

const routes = require("./routes/router");
app.use("/be/v1", routes);

app.listen(
  port,
  () =>
    `Server is running on the port ${port}!
-------------------------------------------------------------------------`
);
