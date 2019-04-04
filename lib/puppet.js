import puppeteer from 'puppeteer';
import sleep from 'sleep';
import { carbonSelectors } from './selectors';
import {
  convertMachineVariables,
  convertStringToNumber,
  findFootPrintPercentage,
  findCost,
} from './math';

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

export async function uploadModel(page, stl, stlName) {
  await page
    .waitForSelector(carbonSelectors.uploadButton)
    .then(() => console.log('Ready for model'));
  await sleep.sleep(2);
  console.log('uploading...');
  const input = await page.$('input[type="file"]');
  // TODO Add a way to pull stls from a list
  await input.uploadFile(stl);
  // await sleep.sleep(5);
  // TODO Figure out a better way to wait for the model.
  let count = 0;
  let partUploaded = false;
  while (partUploaded === false) {
    const partUploadHandle = await page.$(carbonSelectors.partsList);
    const partUploadHTML = await page.evaluate(
      partUpload => partUpload.innerHTML,
      partUploadHandle
    );
    await partUploadHandle.dispose();
    if (partUploadHTML.includes(stlName)) {
      partUploaded = true;
      console.log(`Part ${stlName} has been uploaded!`);
    } else {
      partUploaded = false;
      count += 1;
      console.log(`Waiting on part Upload (${count})`);
      await sleep.sleep(1);
    }
  }
}

export async function selectResin(page, resin) {
  await page.click(carbonSelectors.selectResin);
  await page.keyboard.type(resin, { delay: 100 });
  await page.keyboard.press('Enter');
}

export async function deleteOldModel(page) {
  // Needs to selct th old stl and remove
  await page
    .waitForSelector(carbonSelectors.partsListSelect)
    .then(() => console.log('Ready to click on parts list'));
  await page.click(carbonSelectors.partsListSelect);
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

export async function minFootprint(page) {
  // Orient the part to have the smallest footprint
  await page.click(carbonSelectors.orientTab);
  await sleep.sleep(1);
  await page.click(carbonSelectors.firstPart);
  await page
    .waitForSelector(carbonSelectors.minFootprintBtn)
    .then(() => console.log('Min Footprint button avalible'));
  await page.click(carbonSelectors.minFootprintBtn);
  await sleep.sleep(10);
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
  let count = 0;
  while (noSupports) {
    const supportInfoHandle = await page.$(carbonSelectors.suppotInfo);
    const html = await page.evaluate(
      support => support.innerHTML,
      supportInfoHandle
    );
    await supportInfoHandle.dispose();
    if (html.includes('No Supports')) {
      count += 1;
      console.log(`Model has no supports (${count})`);
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
  let count = 0;
  while (noAnalysis) {
    // TODO Make a switch for if it goes over like 5000 seconds
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
      count += 1;
      console.log(`Waiting for Analysis (${count})`);
      noAnalysis = true;
    } else {
      noAnalysis = false;
    }
    await sleep.sleep(1);
  }
  // await sleep.sleep(3);
  const analysisHandle = await page.$(carbonSelectors.machineTime);
  const machineHTML = await page.evaluate(
    analysis => analysis.innerHTML,
    analysisHandle
  );
  await analysisHandle.dispose();
  const materialHandle = await page.$(carbonSelectors.materialUsage);
  const materialHTML = await page.evaluate(
    material => material.innerHTML,
    materialHandle
  );
  await materialHandle.dispose();
  const materialUsageString = materialHTML.substring(62, 68);
  const buildAreaOfPartHandle = await page.$(carbonSelectors.dimentions);
  const partDims = await page.evaluate(
    dims => dims.innerHTML,
    buildAreaOfPartHandle
  );
  await buildAreaOfPartHandle.dispose();
  const xDimString = partDims.substring(168, 176);
  const yDimString = partDims.substring(330, 338);
  const xDim = convertStringToNumber(xDimString);
  const yDim = convertStringToNumber(yDimString);
  const partAreaPercent = findFootPrintPercentage(xDim, yDim);
  console.log('partAreaPercent', partAreaPercent);
  console.log(xDim);
  console.log(yDim);
  console.log(`Machine Time: ${machineHTML}`);
  console.log(`Material Usage: ${materialUsageString}`);
  const machineTimeMin = convertMachineVariables(machineHTML);
  const materialUsageNum = convertStringToNumber(materialUsageString);
  // const variables = {
  //   machineTime: machineHTML,
  //   materialUsage: materialUsageString,
  // };
  const cost = findCost(
    machineTimeMin,
    materialUsageNum,
    'RPU',
    partAreaPercent
  );
  console.log(cost);
  return cost;
}

export async function close(browser) {
  await browser.close();
}
