import express from "express";
import { checkDb, getList } from "../lib/twitter.js";
import { twitterIds } from "../lib/data.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const artist = req.query.artist;
  const artistId = twitterIds[artist];
  if (artistId) {
    res.status(200).json({ message: `got request for ${artist}` });
  } else {
    res.status(400).json({ message: "wrong artist name" });
  }
  const frontList = await getList(artistId, 10);
  await checkDb(artist, frontList);
});

router.get("/full", async (req, res) => {
  const artist = req.query.artist;
  const artistId = twitterIds[artist];
  if (artistId) {
    res.status(200).json({ message: `got request for ${artist}` });
  } else {
    res.status(400).json({ message: "wrong artist name" });
  }
  const frontList = await getList(artistId, 100);
  await checkDb(artist, frontList);
});

export default router;
