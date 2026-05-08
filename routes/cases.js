const express = require("express");
const router = express.Router();

const caseController = require("../end-point/cases-ep");
const { verifyToken } = require("../middleware/auth-middleware");


router.get("/get-all-cases", verifyToken, caseController.getMyCases);

router.get("/get-selected-case", verifyToken, caseController.getSelectedCase);

module.exports = router;



fullnameenglish
fullnamesinhala
fullnametamil
phonenumber = 9 digits, sri lankan phone
phonecode = '+94'
houseno
streetname
city
district
province
language
