import express from "express";
import {
  getFrontList,
  getFullList,
  updateAll,
  checkDb,
} from "../lib/instagram.js";
import { instagramIds } from "../lib/data.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const artist = req.query.artist;
  const artistId = instagramIds[artist];
  if (artistId) {
    res.status(200).json({ message: `got request for ${artist}` });
  } else {
    res.status(400).json({ message: "wrong artist name" });
  }
  const url = `https://www.instagram.com/${artistId}`;
  const frontList = await getFrontList(url);
  await checkDb(artist, frontList);
  console.log("process done");
});

router.get("/full", async (req, res) => {
  const artist = req.query.artist;
  const artistId = instagramIds[artist];
  if (artistId) {
    res.status(200).json({ message: `got request for ${artist}` });
  } else {
    res.status(400).json({ message: "wrong artist name" });
  }
  const url = `https://www.instagram.com/${artistId}`;
  const fullList = await getFullList(url);
  await updateAll(artist, fullList);
  console.log("process done");
});

export default router;
