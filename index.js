import express from 'express';
import fs from 'fs';
import convertModel from './lib/convert';
import {
  startup,
  gotoURL,
  inLogin,
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

async function carbonGo(model, resinType) {
  const browser = await startup();
  // const inPage = await newTab(browser);
  // await gotoURL(inPage, 'https://inshape.shapeways.com/login');
  // await inLogin(inPage);
  const page = await newTab(browser);
  const resinProject = resinSelect(resinType);
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
  await deleteOldModel(printPage);
  await minFootprint(printPage);
  await maxFootPrint(printPage);
  await checkFit(printPage);
  await layoutPart(printPage);
  await supportPart(printPage);
  const partVariables = await analyzePart(printPage);
  await close(browser);
  return partVariables;
}

// const modelFileName = '7211564.stl';
async function main() {
  const resin = 'UMA';
  const rawData = fs.readFileSync('stls.json');
  const data = JSON.parse(rawData);
  // const stlFile = data[0].stl;
  const outputList = [];
  for await (const stlFile of data) {
    await convertModel(stlFile.model, stlFile.version);
    // TODO Add a check in for weather imputs are ints or strings and convert to strings
    const stlFileName = `${stlFile.model}.stl`;
    console.log(stlFileName);
    const rawCost = await carbonGo(stlFileName, resin);
    const cost = `$${rawCost.toFixed(2)}`;
    const modelWithCost = {
      model: stlFile.model,
      cost,
    };
    outputList.push(modelWithCost);
  }
  const outputData = JSON.stringify(outputList, null, 2);
  fs.writeFileSync('output.json', outputData);
}

main();

// app.get('/scrape', async (req, res, next) => {
//   const variables = await carbonGo();
//   res.json({ variables });
// });

// app.listen(2250, () => {
//   console.log('Example App running on port 2250');
// });
