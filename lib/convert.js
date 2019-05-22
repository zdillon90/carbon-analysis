const { exec } = require('child_process');

function promiseFromChildProcess(childProcess) {
  return new Promise(function(resolve, reject) {
    childProcess.addListener('error', reject);
    childProcess.addListener('exit', resolve);
  });
}

export default async function convertModel(modelNumber, versionNumber) {
  // const modelNumber = '7211564';
  // const versionNumber = '0';

  const command = `/Users/zachd/Documents/udesign/printer_converter.sh -input /Users/zachd/Downloads/${modelNumber}.v${versionNumber}.analytical_mesh_converter.sh.x3db -output /Users/zachd/Downloads/${modelNumber}.stl`;

  const child = exec(command);

  await promiseFromChildProcess(child).then(
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
}

// convertModel('7211564', '0');
