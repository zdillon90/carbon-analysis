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

export async function deleteOldModel(page) {
  // Needs to selct th old stl and remove
  await page
    .waitForSelector(carbonSelectors.partsList)
    .then(() => console.log('Ready to click on parts list'));
  await page.click(carbonSelectors.partsList);
  console.log('Parts list clicked!');
  await page
    .waitForSelector(carbonSelectors.secondPart)
    .then(() => console.log('Old Part on screen'));
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
  let noSupports = true;
  while (noSupports) {
    const supportInfoHandle = await page.$(carbonSelectors.suppotInfo);
    const html = await page.evaluate(
      support => support.innerHTML,
      supportInfoHandle
    );
    await supportInfoHandle.dispose();
    if (html.includes('No Supports')) {
      console.log('Model has no supports');
      noSupports = true;
    } else {
      noSupports = false;
    }
    await sleep.sleep(1);
  }
  console.log('Model has been supported, move on!');
}

export async function analyzePart(page) {
  // This will start the Part Analysis
  await page.click(carbonSelectors.analysisTab);
  await page
    .waitForSelector(carbonSelectors.startAnalysis)
    .then(() => console.log('Analysis Button there'));
  await page.click(carbonSelectors.startAnalysis);
  let noAnalysis = true;
  while (noAnalysis) {
    const waitAnalysis = await page.$(carbonSelectors.beforAnalysis);
    const beforeHTML = await page.evaluate(
      before => before.innerHTML,
      waitAnalysis
    );
    await waitAnalysis.dispose();
    // If statement here
    if (
      beforeHTML.includes(
        'Estimate your print stats and check for printability issues.'
      )
    ) {
      console.log('Waiting for Analysis');
      noAnalysis = true;
    } else {
      noAnalysis = false;
    }
    await sleep.sleep(1);
  }
  // await sleep.sleep(3);
  const analysisHandle = await page.$(carbonSelectors.machineTime);
  const manchineHTML = await page.evaluate(
    analysis => analysis.innerHTML,
    analysisHandle
  );
  await analysisHandle.dispose();
  console.log(manchineHTML);
  const materialHandle = await page.$(carbonSelectors.materialUsage);
  const materialHTML = await page.evaluate(
    material => material.innerHTML,
    materialHandle
  );
  await materialHandle.dispose();
  console.log(materialHTML);
}

export async function close(browser) {
  await browser.close();
}
