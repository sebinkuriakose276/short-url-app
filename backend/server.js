import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import shortenRoutes from "./routes/shorten.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
 

app.use("/", shortenRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
