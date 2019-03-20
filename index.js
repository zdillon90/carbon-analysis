import {
  startup,
  gotoURL,
  getScreenshot,
  close,
  login,
  newTab,
} from './lib/puppet';

require('dotenv').config();

async function go() {
  const browser = await startup();
  const page = await newTab(browser);
  const automationProjectURL =
    'http://m2328.shapeways.print.carbon3d.com/projects/79';
  const carbonURL = 'https://shapeways.print.carbon3d.com/printers';
  await gotoURL(page, carbonURL);
  await login(page);
  const printPage = await newTab(browser);
  await gotoURL(printPage, automationProjectURL);
  const url = printPage.url(automationProjectURL);
  console.log(url);
  if (url !== automationProjectURL) {
    await login(printPage);
  }
  await getScreenshot(printPage);
  // await close(browser);
}

go();
