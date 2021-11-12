import express from "express";
import {
  getFrontList,
  getFullList,
  updateAll,
  checkDb,
} from "../lib/instagram.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.sendStatus(200);
  const artistId = req.query.id;
  //bts.bighitofficial
  const url = `https://www.instagram.com/${artistId}`;
  const frontList = await getFrontList(url);
  await checkDb("bts", frontList);
});

router.get("/full", async (req, res) => {
  res.sendStatus(200);
  const artistId = req.query.id;
  const url = `https://www.instagram.com/${artistId}`;
  const fullList = await getFullList(url);
  await updateAll("bts", fullList);
});

export default router;
