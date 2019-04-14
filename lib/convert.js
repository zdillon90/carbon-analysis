const { exec } = require('child_process');

const command =
  '/Users/zachd/Documents/udesign/printer_converter.sh -input /Users/zachd/Downloads/9026838.v0.analytical_mesh_converter.sh.x3db -output /Users/zachd/Downloads/9026838.stl';

exec(command, (error, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);
  if (error !== null) {
    console.log(`exec error: ${error}`);
  }
});
