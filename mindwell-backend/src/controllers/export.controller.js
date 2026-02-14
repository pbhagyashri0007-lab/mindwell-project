const prisma = require("../config/db");
const { decrypt } = require("../services/encryption.service");

exports.exportUserData = async (req, res) => {
  try {
    const user = req.user;

    // Get journals
    const journals = await prisma.journal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    // Decrypt journals
    const decryptedJournals = journals.map(j => ({
      id: j.id,
      content: decrypt(
        {
          encrypted: j.content,
          iv: j.iv,
          authTag: j.authTag
        },
        user.encryptionKey
      ),
      createdAt: j.createdAt
    }));

    // Get moods
    const moods = await prisma.mood.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    // Prepare export object
    const exportData = {
      user: {
        id: user.id,
        email: user.email,
        isPremium: user.isPremium
      },
      journals: decryptedJournals,
      moods: moods
    };

    res.json(exportData);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// DOWNLOAD USER DATA AS JSON FILE
exports.downloadUserData = async (req, res) => {
  try {
    const user = req.user;

    const journals = await prisma.journal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    const decryptedJournals = journals.map(j => ({
      id: j.id,
      content: decrypt(
        {
          encrypted: j.content,
          iv: j.iv,
          authTag: j.authTag
        },
        user.encryptionKey
      ),
      createdAt: j.createdAt
    }));

    const moods = await prisma.mood.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });

    const exportData = {
      user: {
        id: user.id,
        email: user.email,
        isPremium: user.isPremium
      },
      journals: decryptedJournals,
      moods: moods
    };

    const fileName = "mindwell-data.json";

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", "application/json");

    res.send(JSON.stringify(exportData, null, 2));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
