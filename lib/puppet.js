import puppeteer from 'puppeteer';
import sleep from 'sleep';
import { carbonSelectors } from './selectors';

export async function startup() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1200,
      height: 800,
    },
  });
  return browser;
}

export async function newTab(browser) {
  const page = await browser.newPage();
  return page;
}

export async function gotoURL(page, url) {
  await Promise.all([page.goto(url), page.waitForNavigation()]);
  console.log('Im done waiting');
  return page;
}

export async function login(page) {
  await page
    .waitForSelector(carbonSelectors.userFeild)
    .then(() => console.log('Login Page Loaded'));
  await page.type(carbonSelectors.userFeild, process.env.CARBON_USER);
  await page.type(carbonSelectors.passFeild, process.env.CARBON_PASS);
  await page.click(carbonSelectors.loginButton);
}

export async function uploadModel(page, stl) {
  await page
    .waitForSelector(carbonSelectors.uploadButton)
    .then(() => console.log('Ready for model'));
  await sleep.sleep(2);
  console.log('pressing buttons');
  const input = await page.$('input[type="file"]');
  // TODO Add a way to pull stls from a list
  await input.uploadFile(stl);
  await sleep.sleep(2);
}

export async function deleteOldModel(page, oldModel) {
  // Needs to selct th old stl and remove
  await page
    .waitForSelector(carbonSelectors.partsList)
    .then(() => console.log('Ready to click on parts list'));
  await page.click(carbonSelectors.partsList);
  console.log('Parts list clicked!');
  console.log(`Old Model ${oldModel}`);
  await page
    .waitForSelector(carbonSelectors.secondPart)
    .then(() => console.log('Old Part on seen'));
  await sleep.sleep(1);
  await page.click(carbonSelectors.firstPart);
  console.log('Old Part slected');
  await page.keyboard.press('Delete');
  console.log('Old Part Deleted!');
}

export async function layoutPart(page) {
  // Layout the part on the platform
  await page.click(carbonSelectors.layoutTab);
  await page
    .waitForSelector(carbonSelectors.autolayoutBtn)
    .then(() => console.log('Waiting for autolayout'));
  await page.click(carbonSelectors.autolayoutBtn);
  console.log('Autolayout selected');
}

export async function supportPart(page) {
  // Add basic supports to the model
  await page.click(carbonSelectors.supportTab);
  await page.click(carbonSelectors.firstPart);
  await page.click(carbonSelectors.abovePlat);
  await page.click(carbonSelectors.basicSupport);
  await page.click(carbonSelectors.generateBtn);
  const noSupports = 'No Supports';
  const supportInfoHandle = await page.$(carbonSelectors.suppotInfo);
  const html = await page.evaluate(
    support => support.innerHTML,
    supportInfoHandle
  );
  await supportInfoHandle.dispose();
  // console.log(html.includes(noSupports));
  while (html.includes(noSupports)) {
    console.log('Model has no supports');
    await sleep.sleep(1);
  }
  console.log('Model has been supported, move on!');
}

export async function close(browser) {
  await browser.close();
}
