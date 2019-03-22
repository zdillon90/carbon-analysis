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

async function uploadModel(page, stl) {
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

async function deleteOldModel(page, oldModel) {
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

async function layoutPart(page) {
  // Layout the part on the platform
  await page.click(carbonSelectors.layoutTab);
  await page
    .waitForSelector(carbonSelectors.autolayoutBtn)
    .then(() => console.log('Waiting for autolayout'));
  await page.click(carbonSelectors.autolayoutBtn);
  console.log('Autolayout selected');
}

async function supportPart(page) {
  // Add basic supports to the model
  await page.click(carbonSelectors.supportTab);
  await page.click(carbonSelectors.firstPart);
  await page.click(carbonSelectors.abovePlat);
  await page.click(carbonSelectors.basicSupport);
  await page.click(carbonSelectors.generateBtn);
}

async function close(browser) {
  await browser.close();
}

export {
  startup,
  login,
  newTab,
  gotoURL,
  uploadModel,
  deleteOldModel,
  layoutPart,
  supportPart,
  close,
};
