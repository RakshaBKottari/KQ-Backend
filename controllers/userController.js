const express = require("express");
const userRoutes = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs"); // Import bcrypt
const { connectDB, disconnectDB } = require("../config/db");

// Create User
userRoutes.post("/register", async (req, res) => {
  await connectDB();
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).send({ message: "Please add all fields!" });
      return;
    }

    // Check password length
    if (password.length < 6) {
      res
        .status(400)
        .send({ message: "Password must be at least 6 characters long." });
      return;
    }

    // Check for uppercase letter
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
      res.status(400).send({
        message: "Password must contain at least one uppercase letter.",
      });
      return;
    }

    // Check for special character
    const specialCharRegex = /[!@#$%^&*]/;
    if (!specialCharRegex.test(password)) {
      res.status(400).send({
        message: "Password must contain at least one special character.",
      });
      return;
    }

    // Check for spaces
    const spaceRegex = /\s/;
    if (spaceRegex.test(password)) {
      res.status(400).send({ message: "Password must not contain spaces." });
      return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).send({ message: "User already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10); // Generate salt for password hashing
    const hashedPassword = await bcrypt.hash(password, salt);

    const createUser = await User.create({
      email,
      password: hashedPassword,
    });
    console.log(hashedPassword);

    if (createUser) {
      res.status(201).send({
        success: true,
        message: "User created successfully",
      });
    } else {
      res.status(400).send({ message: "User could not be created" });
    }
    disconnectDB();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Login User
userRoutes.post("/login", async (req, res) => {
  await connectDB();

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({ message: "Please add all fields!" });
      return;
    }

    const user = await User.findOne({ email });

    if (user) {
      try {
        const isLoginSamePassword = await bcrypt.compare(
          password,
          user.password
        );
        if (isLoginSamePassword) {
          res.status(200).send({
            success: true,
            message: "User logged in successfully",
            data: { userEmail: email },
          });
        } else {
          res.status(400).send({ message: "Invalid credentials" });
        }
      } catch (error) {
        res.status(400).send({ message: "Something went wrong" });
      }
    } else {
      res.status(400).send({ message: "User doesn't exist" });
    }
    disconnectDB();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update User Password
userRoutes.put("/update", async (req, res) => {
  await connectDB();
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      res.status(400).send({ message: "Please add all fields!" });
      return;
    }

    // Check password length
    if (password.length < 6) {
      res
        .status(400)
        .send({ message: "Password must be at least 6 characters long." });
      return;
    }

    // Check for uppercase letter
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
      res.status(400).send({
        message: "Password must contain at least one uppercase letter.",
      });
      return;
    }

    // Check for special character
    const specialCharRegex = /[!@#$%^&*]/;
    if (!specialCharRegex.test(password)) {
      res.status(400).send({
        message: "Password must contain at least one special character.",
      });
      return;
    }

    // Check for spaces
    const spaceRegex = /\s/;
    if (spaceRegex.test(password)) {
      res.status(400).send({ message: "Password must not contain spaces." });
      return;
    }

    // Check if the user exists with the provided email
    const userExists = await User.findOne({ email });

    if (!userExists) {
      res.status(404).send({ message: "User not found" });
      return;
    }

    // Compare the new password with the existing hashed password
    const isSamePassword = await bcrypt.compare(password, userExists.password);

    if (isSamePassword) {
      res.status(400).send({
        message: "New password cannot be the same as the old password",
      });
      return;
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the password
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }, // Only update password
      { new: true } // Return the updated user object
    );

    if (updatedUser) {
      res.status(200).send({
        success: true,
        message: "User password updated successfully",
      });
    } else {
      res.status(400).send({ message: "User could not be created" });
    }
    disconnectDB();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = userRoutes;
