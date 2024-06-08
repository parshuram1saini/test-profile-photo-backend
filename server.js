import express from "express"
import dotenv from "dotenv"
import db from "./config/db.js"
import cors from 'cors';
import userRoutes from "./routes/userRoutes.js"
import multer from "multer";
import path from 'path';

dotenv.config();

const app = express();

// Allow all origins
app.use(cors());
app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded({ extended: false })) // url encoded

app.use("/api", userRoutes)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
