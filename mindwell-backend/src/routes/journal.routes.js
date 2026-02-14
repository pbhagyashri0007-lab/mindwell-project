import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import {
  createJournal,
  getJournals,
  searchJournals,
  updateJournal,
  deleteJournal
} from "../controllers/journal.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createJournal);
router.get("/", authMiddleware, getJournals);
router.get("/search", authMiddleware, searchJournals);
router.put("/:id", authMiddleware, updateJournal);
router.delete("/:id", authMiddleware, deleteJournal);

export default router;

