import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import router from './routes/whiteboardRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();


const app = express();
const PORT = process.env.PORT || 5050;


app.use(cors());
app.use(express.json());

//Routes
app.use("/api/whiteboard", router);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});