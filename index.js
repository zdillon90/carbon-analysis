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
  await uploadModel(printPage, '/Users/zachd/Downloads/8939602.stl');
  await deleteOldModel(printPage);
  await minFootprint(printPage);
  await layoutPart(printPage);
  await supportPart(printPage);
  const partVariables = await analyzePart(printPage);
  await close(browser);
  return partVariables;
}

// carbonGo();

app.get('/scrape', async (req, res, next) => {
  const variables = await carbonGo();
  res.json({ variables });
});

app.listen(2250, () => {
  console.log('Example App running on port 2250');
});
