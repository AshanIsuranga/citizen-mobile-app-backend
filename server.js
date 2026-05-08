const express = require("express");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const caseRoutes = require("./routes/cases");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/cases", caseRoutes);

app.use((req, res, next) => {
  console.log("REQUEST:", req.method, req.url);
  next();
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});