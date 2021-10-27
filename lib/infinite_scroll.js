import puppeteer from "puppeteer";

export default async function infiniteScroll(page) {
  await page.evaluate(`let previousHeight;
  do {
    window.scrollTo(0, document.body.scrollHeight);
    previousHeight = document.body.scrollHeight;
  } while (document.body.scrollHeight === previousHeight);`);
}
