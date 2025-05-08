import express from 'express';
import Whiteboard from '../models/Whiteboard.js';

const router = express.Router();

// POST route to create a new whiteboard
router.post('/', (req, res) => {
  const { title, createdBy } = req.body;

  if (!title || !createdBy) {
    return res.status(400).json({ message: "Title and CreatedBy are required." });
  }

  const newWhiteboard = new Whiteboard(Date.now(), title, createdBy);
  res.status(201).json(newWhiteboard);
});

export default router;
