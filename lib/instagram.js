import puppeteer from "puppeteer";
import cheerio from "cheerio";
import Mongoose from "mongoose";
import { getDate } from "./common.js";

const instagramSchema = new Mongoose.Schema({
  id: { type: String, required: true },
  created_at: { type: String, required: true },
  imgSrc: { type: String, required: true },
  type: { type: String, required: true },
});

async function login(page) {
  await page.goto(
    "https://www.instagram.com/accounts/login/?source=auth_switcher"
  );
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', process.env.INSTAGRAM_ID);
  await page.type('input[name="password"]', process.env.INSTAGRAM_PWD);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
}

async function update(Post, item) {
  try {
    const created_at = await getDate(item.imgSrc);
    if (!created_at) {
      console.error(`id ${item.id} is missing`);
      throw new Error();
    }
    new Post({
      id: item.id,
      imgSrc: item.imgSrc,
      created_at,
      type: "instagram",
    }).save();
  } catch (err) {
    console.error(err);
  }
}
export async function getFullList(url) {
  const chromeOptions = {
    headless: true,
    args: ["--incognito", "--no-sandbox"],
  };

  const browser = await puppeteer.launch(chromeOptions);

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
  );

  await login(page);
  console.log("login success");
  await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });
  async function scrollToEndOfPage(page) {
    const items = [];
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
        await page.waitForTimeout(500);
        const content = await page.content();
        const $ = cheerio.load(content);
        $("div.v1Nh3.kIKUG._bz0w").each((index, element) => {
          const id = $(element).children("a").attr("href");
          const imgSrc = $(element)
            .children("a")
            .children("div")
            .children("div")
            .children("img")
            .attr("src");
          if (
            !items.find((i) => {
              return i.id === id;
            })
          ) {
            items.push({ id, imgSrc });
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
    return items;
  }
  const newList = await scrollToEndOfPage(page);
  console.log(newList.length);
  await browser.close();
  return newList;
}
export async function getFrontList(url) {
  const chromeOptions = {
    headless: true,
    args: ["--incognito", "--no-sandbox"],
  };

  const browser = await puppeteer.launch(chromeOptions);

  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
  );
  //await login(page);
  await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });
  const content = await page.content();
  const result = [];
  const $ = cheerio.load(content);
  $("div.v1Nh3.kIKUG._bz0w").each((index, element) => {
    const id = $(element).children("a").attr("href");
    const imgSrc = $(element)
      .children("a")
      .children("div")
      .children("div")
      .children("img")
      .attr("src");
    const date = new Date(imgSrc);
    result.push({ id, imgSrc, date });
  });
  await browser.close();
  if (!result.length) {
    console.log("need login");
  }
  return result;
}
export async function checkDb(artist, list) {
  const Post = Mongoose.model(artist, instagramSchema, artist);

  for (const item of list) {
    Post.find({ id: item.id }, async (err, docs) => {
      if (err) {
        console.error(err);
      } else {
        if (!docs.length) {
          update(Post, item);
          console.log(`${item.id}: updated`);
        }
      }
    });
  }
}
export async function updateAll(artist, list) {
  const Post = Mongoose.model(artist, instagramSchema, artist);

  for (const item of list) {
    await update(Post, item);
  }
}
