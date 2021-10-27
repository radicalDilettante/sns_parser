import express from "express";
import puppeteer from "puppeteer";
import cheerio from "cheerio";
import infiniteScroll from "../lib/infinite_scroll";
import loginInstagram from "../lib/login_instagram";

const router = express.Router();

router.get("/", async (req, res) => {
  const chromeOptions = {
    headless: false,
    //defaultViewport: null,
    args: ["--incognito", "--no-sandbox"],
  };

  const url = "https://www.instagram.com/bts.bighitofficial/";

  const browser = await puppeteer.launch(chromeOptions);

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
  );

  await loginInstagram(page);

  await page.goto(url, { waitUntil: "networkidle2" });

  function extractImgLinks() {
    const extractedElements = document.querySelectorAll("a img");
    const items = [];
    extractedElements.forEach((element) => {
      items.push(element.src);
    });
    return items;
  }

  async function scrollToEndOfPage(page, extractImgLinks = () => {}) {
    let items = [];
    try {
      let previousHeight;
      while (true) {
        const curHeight = await page.evaluate("document.body.scrollHeight");
        if (previousHeight === curHeight) {
          break;
        }
        previousHeight = curHeight;
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)");
        await page.waitForFunction(
          `document.body.scrollHeight > ${previousHeight}`
        );
        await page.waitFor(3500);
        const links = await page.evaluate(extractImgLinks).catch((err) => {
          console.log(err);
          return [];
        });
        items = [...items, ...links];
      }
    } catch (e) {}
    return items;
  }
  // const content = await page.content();

  // const $ = cheerio.load(content);

  // const postList: string[] = [];

  // $("div.v1Nh3.kIKUG._bz0w").each((index, element) => {
  //   const postId = $(element).children("a").attr("href");
  //   postList.push(postId!);
  // });

  // await browser.close();
  // console.log(postList);
});

export default router;
