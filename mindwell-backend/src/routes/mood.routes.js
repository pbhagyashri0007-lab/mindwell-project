const router = require("express").Router();
const moodController = require("../controllers/mood.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, moodController.createMood);
router.get("/", authMiddleware, moodController.getMoods);
router.get("/analytics", authMiddleware, moodController.getAnalytics);

router.get("/analytics/weekly", authMiddleware, moodController.getWeeklyAnalytics);
router.get("/analytics/monthly", authMiddleware, moodController.getMonthlyAnalytics);
router.get("/analytics/emotions", authMiddleware, moodController.getEmotionStats);

module.exports = router;
