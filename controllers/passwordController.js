const express = require("express");
const passwordRoutes = express.Router();
const User = require("../models/userModel");
const Password = require("../models/passwordModel");

const { connectDB, disconnectDB } = require("../config/db");

// add password
passwordRoutes.post("/create/password", async (req, res) => {
  await connectDB();
  try {
    const { email, webName, webEmail, webPassword } = req.body;
    if (!email || !webName || !webEmail || !webPassword) {
      res.status(400).send({ message: "Please add all fields!" });
    }
    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(404).send({ message: "User not found!" });
    } else {
      const addDetails = await Password.create({
        email,
        webName,
        webEmail,
        webPassword,
      });

      if (addDetails) {
        const response = {
          status: true,
          message: "Info added successfully",
        };
        res.status(200).json(response);
      }
    }

    disconnectDB();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = passwordRoutes;
