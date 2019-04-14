import express from 'express';
import {
  startup,
  gotoURL,
  selectResin,
  uploadModel,
  close,
  login,
  newTab,
  deleteOldModel,
  layoutPart,
  maxFootPrint,
  checkFit,
  supportPart,
  analyzePart,
  minFootprint,
} from './lib/puppet';

require('dotenv').config();

const app = express();

const modelFileName = 'original-7934871_v0.stl';
const resin = 'EPU';

function resinSelect(resinName) {
  if (resinName === 'RPU') {
    return '79';
  }
  if (resinName === 'EPU') {
    return '128';
  }
  if (resinName === 'UMA') {
    return '129';
  }
  console.log('Resin input invalid');
}

async function carbonGo(model) {
  const browser = await startup();
  const page = await newTab(browser);
  const resinProject = resinSelect(resin);
  const automationProjectURL = `http://m2328.shapeways.print.carbon3d.com/projects/${resinProject}`;
  const carbonURL = 'https://shapeways.print.carbon3d.com/printers';
  await gotoURL(page, carbonURL);
  await login(page);
  const printPage = await newTab(browser);
  await gotoURL(printPage, automationProjectURL);
  const url = printPage.url(automationProjectURL);
  if (url !== automationProjectURL) {
    await login(printPage);
  }
  await uploadModel(printPage, `/Users/zachd/Downloads/${model}`, model);
  // await selectResin(printPage, 'RPU 70');
  // 8939602 Good model file for testing
  await deleteOldModel(printPage);
  await minFootprint(printPage);
  await maxFootPrint(printPage);
  await checkFit(printPage);
  await layoutPart(printPage);
  await supportPart(printPage);
  // TODO Need to add duplication for orders of more than 1
  // There will be a need to look at deleting only all but one with multiples
  const partVariables = await analyzePart(printPage);
  await close(browser);
  return partVariables;
}

carbonGo(modelFileName);

// app.get('/scrape', async (req, res, next) => {
//   const variables = await carbonGo();
//   res.json({ variables });
// });

// app.listen(2250, () => {
//   console.log('Example App running on port 2250');
// });
