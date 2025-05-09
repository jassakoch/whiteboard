// models/Whiteboard.js

import mongoose from "mongoose";

const whiteboardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  content: {
    type: Array,
    default: [],
  },
});

const Whiteboard = mongoose.model("Whiteboard", whiteboardSchema);

export default Whiteboard;
