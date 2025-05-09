// routes/whiteboardRoutes.js
import express from "express";
import Whiteboard from "../models/Whiteboard.js";

const router = express.Router();

// POST route to create a new whiteboard
router.post("/", async (req, res) => {
  const { title, createdBy } = req.body;

  if (!title || !createdBy) {
    return res.status(400).json({ message: "Title and CreatedBy are required." });
  }

  try {
    const newWhiteboard = new Whiteboard({ title, createdBy });
    const savedWhiteboard = await newWhiteboard.save();
    res.status(201).json(savedWhiteboard);
  } catch (error) {
    console.error("Error saving whiteboard:", error.message);
    res.status(500).json({ message: "Server error. Could not save whiteboard." });
  }
});

export default router;
