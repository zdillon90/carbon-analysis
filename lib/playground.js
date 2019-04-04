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

./printer_converter.sh -input /Users/zachd/Downloads/7932931.v0.analytical_mesh_converter.sh.x3db -output /Users/zachd/Downloads/7932931.stl

