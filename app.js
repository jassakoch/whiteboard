
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import whiteboardRouter from './routes/whiteboardRoutes.js';
import userRouter from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log("➡️ Incoming:", req.method, req.originalUrl);
  next();
});


app.get("/health", (req, res) => {
  res.send("OK");
});


app.post("/debug", (req, res) => {
  console.log("BODY:", req.body);
  res.json(req.body);
});

app.use("/api/whiteboard", whiteboardRouter);
app.use("/api/users", userRouter);

export default app;
