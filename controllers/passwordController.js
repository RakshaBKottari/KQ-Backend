const express = require("express");
const passwordRoutes = express.Router();
const User = require("../models/userModel");
const Password = require("../models/passwordModel");

const { connectDB, disconnectDB } = require("../config/db");

// Create password
passwordRoutes.post("/create/password", async (req, res) => {
  await connectDB();
  try {
    const { email, webName, webEmail, webPassword } = req.body;
    if (!email || !webName || !webEmail || !webPassword) {
      return res.status(400).send({ message: "Please add all fields!" });
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(404).send({ message: "User not found!" });
    }

    const addDetails = await Password.create({
      email,
      webName,
      webEmail,
      webPassword,
    });

    if (addDetails) {
      res
        .status(200)
        .json({ status: true, message: "Info added successfully" });
    }

    disconnectDB();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get all password entries by email
// Get all password entries by email (payload-based)
passwordRoutes.get("/get/passwords", async (req, res) => {
  await connectDB();
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Please provide the email!" });
    }

    const userExists = await User.findOne({ email });
    if (!userExists) {
      return res.status(404).send({ message: "User not found!" });
    }

    const passwordDetails = await Password.find({ email });
    if (passwordDetails.length === 0) {
      return res
        .status(404)
        .send({ message: "No password details found for this user!" });
    }

    res.status(200).json({
      success: true,
      data: passwordDetails,
    });

    disconnectDB();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update password by id
passwordRoutes.put("/update/password", async (req, res) => {
  await connectDB();
  try {
    // const { id } = req.params;
    const { id, webName, webEmail, webPassword } = req.body;

    if (!id || !webName || !webEmail || !webPassword) {
      return res.status(400).send({ message: "Please provide all details!" });
    }

    const passwordDetails = await Password.findById(id);
    if (!passwordDetails) {
      return res.status(404).send({ message: "Password entry not found!" });
    }

    passwordDetails.webEmail = webEmail;
    passwordDetails.webPassword = webPassword;
    passwordDetails.webName = webName;

    await passwordDetails.save();

    res.status(200).json({
      success: true,
      message: "Password details updated successfully",
      data: passwordDetails,
    });

    disconnectDB();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Delete password by id
passwordRoutes.delete("/delete/password", async (req, res) => {
  await connectDB();
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({ message: "Please provide the id!" });
    }

    const passwordDetails = await Password.findByIdAndDelete(id);
    if (!passwordDetails) {
      return res.status(404).send({ message: "Password entry not found!" });
    }

    res.status(200).json({
      success: true,
      message: "Password details deleted successfully",
    });

    disconnectDB();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = passwordRoutes;
