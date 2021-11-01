import express from "express";
import { getFullList } from "../lib/instagram.js";
import * as fs from "fs";

const router = express.Router();

router.get("/", async (req, res) => {
  const artistId = "bts.bighitofficial";
  const url = `https://www.instagram.com/${artistId}`;
  const fullList = await getFullList(url);

  const result = JSON.stringify(fullList);
  const filename = `./example.json`;
  fs.writeFileSync(filename, result);
});

export default router;
