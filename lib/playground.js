const axios = require('axios');
const rp = require('request-promise');
require('dotenv').config();

// const string =
// '<div>Part and support volume</div><div><!-- react-text: 677 -->2.1<!-- /react-text --><!-- react-text: 678 --> ml<!-- /react-text --></div>';

// const numbers = string.match(/\d+/g).map(Number);
// const numbers = string.substring(63, 66);
// console.log(numbers);

// const machineTime = '33m';
// const time = machineTime.match(/\d+/g).map(Number);
// if (machineTime.includes('h')) {
//   console.log('Machine Time has hours');
//   const hourToMin = time[0] * 60;
//   const totalMin = hourToMin + time[1];
//   console.log(totalMin);
// } else {
//   console.log('Machine time is just minutes');
//   const min = time[0];
//   console.log(min);
// }

// const mu = '>25.5<';
// const materialString = mu.replace('>', '');
// const materialFloat = parseFloat(materialString);
// console.log(materialFloat);

// const materialName = 'RPU';
// const materialDollarValue = materialName === 'UMA' ? 0.16 : 0.25;

// console.log(`Material Dollar Value: $${materialDollarValue}`);

// const string = '>119<!--';
// const materialString = string.replace(/[->!< ]/g, '');
// console.log(materialString);

// const platformX = 188;
// const platformY = 116.8;
// const platformArea = platformX * platformY;
// const partArea = 119 * 95;
// const partPercentage = partArea / platformArea;
// console.log(partPercentage);

// ./printer_converter.sh -input /Users/zachd/Downloads/9026838.v0.analytical_mesh_converter.sh.x3db -output /Users/zachd/Downloads/9026838.stl

const url = 'http://requestbin.fullcontact.com/151tll61';

// console.log(url);

// const postData = {
//   grant_type: 'client_credentials',
// };

// const clientCreds = {
//   id: process.env.CLIENT_ID,
//   secret: process.env.CLIENT_SECRET,
// };

// console.log(clientCreds);

// axios({
//   method: 'post',
//   url,
//   data: postData,
//   response_type: 'token',
//   auth: {
//     client_id: process.env.CLIENT_ID,
//     client_secret: process.env.CLIENT_SECRET,
//   },
// })
//   .then(function(response) {
//     console.log(response);
//   })
//   .catch(function(error) {
//     console.log(error);
//   });

const authorize = async function authorizeClient() {
  const options = {
    url: 'https://api.shapeways.com/oauth2/token',
    headers: {
      grant_type: 'client_credentials',
    },
    auth: {
      user: process.env.CLIENT_ID,
      pass: process.env.CLIENT_SECRET,
    },
    form: {
      grant_type: 'client_credentials',
    },
  };
  const result = await rp.post(options);
  const token = JSON.parse(result).access_token;
  return token;
};

async function downloadModel() {
  // Download the mdoel from the inshape API
  const authToken = await authorize();
  const options = {
    url: 'https://api.shapeways.com/models/8849817/v1',
    // These only give access to my models ^^^
    headers: {
      authorization: `bearer ${authToken}`,
    },
  };
  const result = await rp.get(options);
  const manufacturers = JSON.parse(result);
  return manufacturers;
}

async function main() {
  const model = await downloadModel();
  console.log('model', model);
}

main();
