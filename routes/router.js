const express = require("express");
const router = express.Router();
const userRoutes = require("../controllers/userController");
const passwordRoutes = require("../controllers/passwordController");

router.use("/user", userRoutes);
router.use("/password", passwordRoutes);

module.exports = router;
