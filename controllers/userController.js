const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs"); // Import bcrypt

// Create User
const createUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: "Please add all fields!" });
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
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: "Please add all fields!" });
    return;
  }

  const user = await User.findOne({ email });

  if (user) {
    try {
      const isLoginSamePassword = await bcrypt.compare(password, user.password);
      if (isLoginSamePassword) {
        res.status(200).send({
          success: true,
          data: { EmailID: email },
          message: "User logged in successfully",
        });
      } else {
        res.status(400).send({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(400).send({ message: "something went wrong" });
    }
  } else {
    res.status(400).send({ message: "user doesnt exist" });
  }
});

// Update User Password
const updateUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    res.status(400).send({ message: "Please add all fields!" });
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
    res
      .status(400)
      .send({ message: "New password cannot be the same as the old password" });
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
});

module.exports = { createUser, loginUser, updateUser };
