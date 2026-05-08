const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authDao = require("../dao/auth-dao");

// Signup
exports.signup = async (req, res) => {
  try {
    const { username, password, nic, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    console.log('username', username)

    const existing = await authDao.findUserByUsername(username);

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await authDao.createUser(username, password, nic, email);

    return res.json({
      message: "User created",
      user,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // 2. Get user from DB
    const user = await authDao.findUserByUsername(username);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 4. Create JWT payload
    const payload = {
      userId: user.id,
      username: user.username,
      language: user.language
    };

    // 5. Sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

    // 6. Send response (structured for frontend)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          username: user.username,
          language: user.language,
        },
        token: token,
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      },
    });

  } catch (err) {
    console.error("Login error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};