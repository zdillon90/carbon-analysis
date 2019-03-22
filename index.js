import {
  startup,
  gotoURL,
  uploadModel,
  close,
  login,
  newTab,
  deleteOldModel,
  layoutPart,
  supportPart,
} from './lib/puppet';

require('dotenv').config();

async function go() {
  const oldModel = './original-8876630_v0.stl';
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
  if (url !== automationProjectURL) {
    await login(printPage);
  }
  await uploadModel(printPage, './original-8904665_v0.stl');
  await deleteOldModel(printPage, oldModel);
  await layoutPart(printPage);
  await supportPart(printPage);
  // await close(browser);
}

go();
