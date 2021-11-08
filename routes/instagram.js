import express from "express";
import { getFrontList, getDetail } from "../lib/instagram.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const artistId = req.query.id;
  //bts.bighitofficial
  const url = `https://www.instagram.com/${artistId}`;
  const frontList = await getFrontList(url);
  const listWithTime = await getDetail(frontList);
  console.log(listWithTime);
  res.sendStatus(200);
});

router.get("/full", async (req, res) => {
  const artistId = req.query.id;
  //bts.bighitofficial
  const url = `https://www.instagram.com/${artistId}`;
  const fullList = await getFullList(url);
  fullList.forEach((post) => {
    console.log(post);
  });
  res.sendStatus(200);
});

export default router;
