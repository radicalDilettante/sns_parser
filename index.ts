import express from "express";
import scraperRouter from "./routes/scraper";

const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/user", scraperRouter);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
