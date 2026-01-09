// routes/whiteboardRoutes.js
import express from "express";
import Whiteboard from "../models/Whiteboard.js";
import mongoose from 'mongoose';
import protect from "../middleware/auth.js";


const whiteboardRouter = express.Router();
whiteboardRouter.use(protect);

//GET route for logged in user
whiteboardRouter.get('/', async(req,res) => {
  try { 
    const whiteboards = await Whiteboard.find({
      createdBy: req.user.id
    }).sort({ createdAt: -1 });

  res.status(200).json(whiteboards);

  } catch(error) {
  res.status(500).json({ message: error.message});
}
});



function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

whiteboardRouter.post("/", async (req, res) => {
  const { title } = req.body || {};
  if (!title) return res.status(400).json({ message: "Title is required." });

  try {
    const regexTitle = escapeRegex(title);

    const existing = await Whiteboard.find({
      createdBy: req.user.id,
      title: { $regex: `^${regexTitle}` }
    });

    let finalTitle = title;
    if (existing.length > 0) {
      finalTitle = `${title} [${existing.length}]`;
    }

    const whiteboard = await Whiteboard.create({
      title: finalTitle,
      createdBy: req.user.id,
    });

    res.status(201).json(whiteboard);
  } catch (error) {
    console.error("Error saving whiteboard:", error);
    res.status(500).json({ message: "Server error. Could not save whiteboard." });
  }
});


//DELETE route to delete whiteboard by ID
whiteboardRouter.delete('/:id', async (req, res) => {
  try {
    const whiteboard = await Whiteboard.findById(req.params.id);
    if (!whiteboard) {
      return res.status(404).json({ message: 'Whiteboard not found' });
    }

    //ownership check
    if(whiteboard.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized'});
    }

    await whiteboard.deleteOne();

    res.status(200).json({ message: 'Whiteboard deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

// PUT route to update a whiteboard by ID
whiteboardRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Whiteboard not found' });
  }

  try {
    const whiteboard = await Whiteboard.findById(id);

    if (!whiteboard) {
      return res.status(404).json({ message: 'Whiteboard not found' });
    }

    // 🔐 ownership check
    if (whiteboard.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    whiteboard.title = title ?? whiteboard.title;
    await whiteboard.save();

    res.status(200).json(whiteboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export default whiteboardRouter;
