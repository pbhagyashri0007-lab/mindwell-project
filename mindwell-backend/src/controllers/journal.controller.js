import prisma from "../config/db.js";
import { encrypt, decrypt } from "../services/encryption.service.js";


// ================= CREATE =================
export const createJournal = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const encrypted = encrypt(content, req.user.encryptionKey);

    const journal = await prisma.journal.create({
      data: {
        content: encrypted.content,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        userId: req.user.id
      }
    });

    res.json({ message: "Journal saved securely 🔒", journal });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= GET ALL =================
export const getJournals = async (req, res) => {
  try {
    const journals = await prisma.journal.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" }
    });

    const decrypted = journals.map(j => ({
      ...j,
      content: decrypt(
        j.content,
        j.iv,
        j.authTag,
        req.user.encryptionKey
      )
    }));

    res.json({ data: decrypted });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= SEARCH =================
export const searchJournals = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({ message: "Keyword required" });
    }

    const journals = await prisma.journal.findMany({
      where: { userId: req.user.id }
    });

    const decrypted = journals.map(j => ({
      ...j,
      content: decrypt(
        j.content,
        j.iv,
        j.authTag,
        req.user.encryptionKey
      )
    }));

    const filtered = decrypted.filter(j =>
      j.content.toLowerCase().includes(keyword.toLowerCase())
    );

    res.json(filtered);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= UPDATE =================
export const updateJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const encrypted = encrypt(content, req.user.encryptionKey);

    const updated = await prisma.journal.updateMany({
      where: {
        id,
        userId: req.user.id
      },
      data: {
        content: encrypted.content,
        iv: encrypted.iv,
        authTag: encrypted.authTag
      }
    });

    if (updated.count === 0) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json({ message: "Journal updated ✏️" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ================= DELETE =================
export const deleteJournal = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await prisma.journal.deleteMany({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Journal not found" });
    }

    res.json({ message: "Journal deleted 🗑️" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
