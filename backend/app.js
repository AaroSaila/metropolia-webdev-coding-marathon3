import dotenv from "dotenv";
import express from "express";
import jobRouter from "./routes/jobRouter.js";
import userRouter from "./routes/userRouter.js";
import { unknownEndpoint, errorHandler } from "./middleware/customMiddleware.js";
import connectDB from "./config/db.js";
import cors from "cors";


dotenv.config();
const app = express();

// Middlewares
app.use(cors())
app.use(express.json());

connectDB();

// Use the jobRouter for all "/jobs" routes
app.use("/api/jobs", jobRouter);
app.use("/api/users", userRouter);

app.use(unknownEndpoint);
app.use(errorHandler);


export default app;

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`)
// })  
