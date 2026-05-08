const casesDao = require("../dao/cases-dao");

exports.getMyCases = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({
        message: "Missing user id",
      });
    }

    console.log("userId:", userId);

    // Get NIC
    const user = await casesDao.getUserNicDao(userId);

    console.log("user:", user);

    if (!user || !user.nic) {
      return res.status(404).json({
        message: "NIC not found for user",
      });
    }

    // Get cases
    const cases = await casesDao.getAllCasesForUser(user.nic);

    console.log('cases', cases)

    return res.status(200).json({
      message: "Cases fetched successfully",
      total: cases.length,
      cases,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.getSelectedCase = async (req, res) => {
  try {
    const { caseId } = req.query;

    if (!caseId) {
      return res.status(400).json({
        message: "Missing caseId",
      });
    }

    console.log("caseId:", caseId);

    const caseData = await casesDao.getSelectedCase(caseId);

    console.log('caseData', caseData)

    return res.status(200).json({
      message: "Cases fetched successfully",
      case: caseData,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server error",
    });
  }
};