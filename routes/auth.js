const express = require("express");
const router = express.Router();

const authController = require("../end-point/auth-ep");

// Endpoint
router.post("/signup", authController.signup);

router.post("/login", authController.login);

module.exports = router;