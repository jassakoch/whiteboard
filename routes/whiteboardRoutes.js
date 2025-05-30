// routes/whiteboardRoutes.js
import express from "express";
import Whiteboard from "../models/Whiteboard.js";
import mongoose from 'mongoose';


const whiteboardRouter = express.Router();

//GET route to get a whiteboard by ID
whiteboardRouter.get('/:id', async(req,res) => {
  try { 
    const { id  } = req.params;

 // Check if the provided id is a valid ObjectId
 if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(404).json({ message: 'Whiteboard not found' });
}

    const whiteboard = await Whiteboard.findById(id);
    console.log("Fetched Whiteboard:", whiteboard); 


  if(!whiteboard) {
    return res.status(404).json({message: 'Whiteboard not found'})
  }


  res.status(200).json(whiteboard);

} catch(err) {
  console.error("Error in GET /api/whiteboard/:id", err);
  res.status(500).json({ message: err.message})
}
});



// POST route to create a new whiteboard
whiteboardRouter.post("/", async (req, res) => {
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

//DELETE route to delete whiteboard by ID
whiteboardRouter.delete('/:id', async (req, res) => {
  try {
    const whiteboard = await Whiteboard.findByIdAndDelete(req.params.id);
    if (!whiteboard) {
      return res.status(404).json({ message: 'Whiteboard not found' });
    }
    res.status(200).json({ message: 'Whiteboard deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})



export default whiteboardRouter;
