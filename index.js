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
  // const stlPath = `C:\\Users\\Zach Dillon\\Documents\\Carbon\\analysis_models\\${model}`;
  const stlPath = `C:\\Users\\Zach Dillon\\Downloads\\${model}`;
  await gotoURL(page, carbonURL);
  await login(page);
  const printPage = await newTab(browser);
  await gotoURL(printPage, automationProjectURL);
  const url = printPage.url(automationProjectURL);
  if (url !== automationProjectURL) {
    await login(printPage);
  }
  console.log('Checking to model path');
  const fileExists = fs.access(stlPath, fs.F_OK, err => {
    if (err) {
      console.error(err);
      return 'err';
    }
    console.log('file exists');
    return 'file';
  });
  console.log('fileExists:', fileExists);
  await uploadModel(printPage, stlPath, model);
  console.log('Upload should be complete');
  await deleteOldModel(printPage);
  await minFootprint(printPage);
  // await maxFootPrint(printPage);
  await checkFit(printPage);
  await layoutPart(printPage);
  await supportPart(printPage);
  const partVariables = await analyzePart(printPage);
  await close(browser);
  return partVariables;
}

async function main() {
  const rawData = fs.readFileSync('stls1.json');
  const data = JSON.parse(rawData);
  const outputList = [];
  for await (const stlFile of data) {
    const { resin, model, version } = stlFile;
    // await convertModel(model, version);
    const stlFileName = `${model}.stl`;
    console.log(stlFileName);
    const rawValues = await carbonGo(stlFileName, resin);
    const rawCost = rawValues.cost;
    const { machineTimeMin } = rawValues;
    // TODO if the model is not found then continue the loop
    const cost = `$${rawCost.toFixed(2)}`;
    const modelWithCost = {
      model,
      cost,
      machineTimeMin,
      resin,
    };
    outputList.push(modelWithCost);
    const outputData = JSON.stringify(outputList, null, 2);
    fs.writeFileSync('output.json', outputData);
  }
}

main();

// app.get('/scrape', async (req, res, next) => {
//   const variables = await carbonGo();
//   res.json({ variables });
// });

// app.listen(2250, () => {
//   console.log('Example App running on port 2250');
// });
