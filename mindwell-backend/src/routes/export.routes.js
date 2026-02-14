const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const exportController = require("../controllers/export.controller");

router.get("/", authMiddleware, exportController.exportUserData);
router.get("/download", authMiddleware, exportController.downloadUserData);

module.exports = router;
