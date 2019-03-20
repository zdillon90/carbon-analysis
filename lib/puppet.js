import puppeteer from 'puppeteer';
import sleep from 'sleep';
import { carbonSelectors } from './selectors';

async function startup() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1200,
      height: 800,
    },
  });
  return browser;
}

async function newTab(browser) {
  const page = await browser.newPage();
  return page;
}

async function gotoURL(page, url) {
  await Promise.all([page.goto(url), page.waitForNavigation()]);
  console.log('Im done waiting');
  return page;
}

async function login(page) {
  const cuf = carbonSelectors.userFeild;
  const cpf = carbonSelectors.passFeild;
  const lb = carbonSelectors.loginButton;
  await page.waitForSelector(cuf).then(() => console.log('Login Page Loaded'));
  await page.type(cuf, process.env.CARBON_USER);
  await page.type(cpf, process.env.CARBON_PASS);
  await page.click(lb);
}

async function getScreenshot(page) {
  await page
    .waitForSelector(carbonSelectors.uploadButton)
    .then(() => console.log('Ready for model'));
  await sleep.sleep(2);
  console.log('pressing buttons');
  const input = await page.$('input[type="file"]');
  await input.uploadFile('./original-8876630_v0.stl');
  // await page.screenshot({ path: 'example.png' });
  // console.log('Screen Shot Taken');
}

async function close(browser) {
  await browser.close();
}

export { startup, newTab, gotoURL, getScreenshot, login, close };
