const express = require("express");
const router = express.Router();
const {
  createUser,
  updateUser,
  loginUser,
} = require("../controllers/userController");

router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/update", updateUser);

module.exports = router;
