import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from './routes/whiteboardRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;


app.use(cors());
app.use(express.json());
app.use("/api/whiteboard", router);




app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});