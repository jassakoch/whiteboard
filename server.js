// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import whiteboardRouter from './routes/whiteboardRoutes.js';
// import userRouter from "./routes/userRoutes.js";

// dotenv.config();

// // Connect to MongoDB
// connectDB();


// const app = express();
// const PORT = process.env.PORT || 5050;


// app.use(cors());
// app.use(express.json());

// //Routes
// app.use("/api/whiteboard", whiteboardRouter);
// app.use("/api/users", userRouter);


// app.listen(PORT, () => {
//   console.log(`✅ Server is running on http://localhost:${PORT}`);
// });


// export default app;  

import app from "./app.js";

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

