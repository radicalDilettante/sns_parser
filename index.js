import express from "express";
import scraperRouter from "./routes/entire_instagram";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/scraper", scraperRouter);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
