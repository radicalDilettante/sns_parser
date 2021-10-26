import puppeteer from "puppeteer";

export default async function loginInstagram(page: puppeteer.Page) {
  await page.goto(
    "https://www.instagram.com/accounts/login/?source=auth_switcher"
  );
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', process.env.INSTAGRAM_ID!);
  await page.type('input[name="password"]', process.env.INSTAGRAM_PWD!);
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
}
