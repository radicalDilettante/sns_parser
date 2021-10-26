import puppeteer from "puppeteer";

export default async function infiniteScroll(page: puppeteer.Page) {
  await page.evaluate(`let previousHeight;
  do {
    window.scrollTo(0, document.body.scrollHeight);
    previousHeight = document.body.scrollHeight;
  } while (document.body.scrollHeight === previousHeight);`);
}
