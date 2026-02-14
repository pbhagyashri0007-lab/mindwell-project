const prisma = require("../config/db");

// CREATE MOOD ENTRY
exports.createMood = async (req, res) => {
  try {
    const { mood, energy, emotion } = req.body;

    const newMood = await prisma.mood.create({
      data: {
        mood,
        energy,
        emotion,
        userId: req.user.id
      }
    });

    res.json({
      message: "Mood logged successfully 📊",
      newMood
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// GET ALL USER MOODS
exports.getMoods = async (req, res) => {
  try {
    const moods = await prisma.mood.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    res.json(moods);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// PREMIUM ANALYTICS
exports.getAnalytics = async (req, res) => {
  try {
    // 🔒 Premium check
    if (!req.user.isPremium) {
      return res.status(403).json({
        message: "Upgrade to Premium to access analytics 💎"
      });
    }

    const moods = await prisma.mood.findMany({
      where: { userId: req.user.id }
    });

    if (moods.length === 0) {
      return res.json({
        message: "No mood data available",
        totalEntries: 0
      });
    }

    const totalEntries = moods.length;

    const avgMood =
      moods.reduce((sum, m) => sum + m.mood, 0) / totalEntries;

    const avgEnergy =
      moods.reduce((sum, m) => sum + m.energy, 0) / totalEntries;

    // Most common emotion
    const emotionCount = {};
    moods.forEach(m => {
      emotionCount[m.emotion] =
        (emotionCount[m.emotion] || 0) + 1;
    });

    const mostCommonEmotion = Object.keys(emotionCount)
      .reduce((a, b) =>
        emotionCount[a] > emotionCount[b] ? a : b
      );

    // Mood trend data
    const trend = moods.map(m => ({
      date: m.createdAt,
      mood: m.mood,
      energy: m.energy
    }));

    res.json({
      totalEntries,
      averageMood: avgMood.toFixed(2),
      averageEnergy: avgEnergy.toFixed(2),
      mostCommonEmotion,
      trend
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// WEEKLY AVERAGE MOOD
exports.getWeeklyAnalytics = async (req, res) => {
  try {
    if (!req.user.isPremium) {
      return res.status(403).json({
        message: "Upgrade to Premium to access analytics 💎"
      });
    }

    const result = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('week', "createdAt") AS week,
        AVG(mood) AS avg_mood,
        AVG(energy) AS avg_energy
      FROM "Mood"
      WHERE "userId" = ${req.user.id}
      GROUP BY week
      ORDER BY week ASC
    `;

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// MONTHLY AVERAGE MOOD
exports.getMonthlyAnalytics = async (req, res) => {
  try {
    if (!req.user.isPremium) {
      return res.status(403).json({
        message: "Upgrade to Premium to access analytics 💎"
      });
    }

    const result = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") AS month,
        AVG(mood) AS avg_mood,
        AVG(energy) AS avg_energy
      FROM "Mood"
      WHERE "userId" = ${req.user.id}
      GROUP BY month
      ORDER BY month ASC
    `;

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// EMOTION DISTRIBUTION (Pie Chart Ready)
exports.getEmotionStats = async (req, res) => {
  try {
    if (!req.user.isPremium) {
      return res.status(403).json({
        message: "Upgrade to Premium to access analytics 💎"
      });
    }

    const result = await prisma.$queryRaw`
      SELECT emotion, COUNT(*) as count
      FROM "Mood"
      WHERE "userId" = ${req.user.id}
      GROUP BY emotion
      ORDER BY count DESC
    `;

    res.json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
