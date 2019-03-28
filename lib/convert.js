const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function convertToSTL(modelId) {
  const { stdout, stderr } = await exec(
    `./printer_converter.sh -input /Users/zachd/Downloads/${modelId}.v1.analytical_mesh_converter.sh.x3db -output /Users/zachd/Downloads/${modelId}.stl`
  );
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}

convertToSTL('8939602');
