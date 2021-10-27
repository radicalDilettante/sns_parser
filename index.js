import express from "express";
import scraperRouter from "./routes/entire_instagram.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

const server = async () => {
  try {
    dotenv.config();
    await mongoose.connect(process.env.DB_URI);
    console.log("DB connected");

    const app = express();
    app.get("/", (req, res) => {
      res.send("hello world");
    });

    app.use("/scraper", scraperRouter);

    app.listen(3000, () => {
      console.log("Server listening on port 3000");
    });
  } catch (err) {
    console.log(err);
  }
};

server();
