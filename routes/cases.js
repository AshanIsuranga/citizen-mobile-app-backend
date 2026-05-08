const express = require("express");
const router = express.Router();

const caseController = require("../end-point/cases-ep");
const { verifyToken } = require("../middleware/auth-middleware");


router.get("/get-all-cases", verifyToken, caseController.getMyCases);

router.get("/get-selected-case", verifyToken, caseController.getSelectedCase);

module.exports = router;

