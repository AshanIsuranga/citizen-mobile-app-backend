const pool = require("../db/pool");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

// Create user
exports.createUser = async (username, password, nic, email) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const sql = `
    INSERT INTO users (username, password, nic, email)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, nic, email;
  `;

  const result = await pool.query(sql, [
    username,
    hashedPassword,
    nic,
    email,
  ]);

  return result.rows[0];
};

// Find user by username
exports.findUserByUsername = async (username) => {
  const sql = `SELECT * FROM users WHERE username = $1`;
  const result = await pool.query(sql, [username]);
  return result.rows[0];
};