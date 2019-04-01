import express from 'express';
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
  analyzePart,
  minFootprint,
} from './lib/puppet';

require('dotenv').config();

const app = express();

async function carbonGo() {
  const modelFileName = 'original-8956416_v0.stl';
  const browser = await startup();
  const page = await newTab(browser);
  const automationProjectURL =
    'http://m2328.shapeways.print.carbon3d.com/projects/79';
  // TODO Each Material will have it's own project and API endpoint
  const carbonURL = 'https://shapeways.print.carbon3d.com/printers';
  await gotoURL(page, carbonURL);
  await login(page);
  const printPage = await newTab(browser);
  await gotoURL(printPage, automationProjectURL);
  const url = printPage.url(automationProjectURL);
  if (url !== automationProjectURL) {
    await login(printPage);
  }
  await uploadModel(printPage, `/Users/zachd/Downloads/${modelFileName}`);
  // 8939602 Good model file for testing
  await deleteOldModel(printPage);
  await minFootprint(printPage);
  await layoutPart(printPage);
  await supportPart(printPage);
  // TODO Need to add duplication for orders of more than 1
  // There will be a need to look at deleting only all but one with multiples
  const partVariables = await analyzePart(printPage);
  await close(browser);
  return partVariables;
}

carbonGo();

// app.get('/scrape', async (req, res, next) => {
//   const variables = await carbonGo();
//   res.json({ variables });
// });

// app.listen(2250, () => {
//   console.log('Example App running on port 2250');
// });
