const { exec } = require('child_process');

// function convertToStl(modelNumber, versionNumber) {
//   exec(command, (error, stdout, stderr) => {
//     console.log(stdout);
//     console.log(stderr);
//     if (error !== null) {
//       console.log(`exec error: ${error}`);
//     }
//   });
//   console.log('Convert Complete');
// }

// convertToStl('9026838', '0');

// const Promise = require('bluebird');
// const exec = require('child_process').execFile;

function promiseFromChildProcess(childProcess) {
  return new Promise(function(resolve, reject) {
    childProcess.addListener('error', reject);
    childProcess.addListener('exit', resolve);
  });
}

const modelNumber = '9155940';
const versionNumber = '0';

const command = `/Users/zachd/Documents/udesign/printer_converter.sh -input /Users/zachd/Downloads/${modelNumber}.v${versionNumber}.analytical_mesh_converter.sh.x3db -output /Users/zachd/Downloads/${modelNumber}.stl`;

const child = exec(command);

promiseFromChildProcess(child).then(
  function(result) {
    console.log(`promise complete: ${result}`);
  },
  function(err) {
    console.log(`promise rejected: ${err}`);
  }
);

child.stdout.on('data', function(data) {
  console.log(`stdout: ${data}`);
});
child.stderr.on('data', function(data) {
  console.log(`stderr: ${data}`);
});
child.on('close', function(code) {
  console.log(`closing code: ${code}`);
});
