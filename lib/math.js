export function convertMachineVariables(machineTime) {
  // const machineTime = '33m';
  const time = machineTime.match(/\d+/g).map(Number);
  if (machineTime.includes('h')) {
    console.log('Machine Time has hours');
    const hourToMin = time[0] * 60;
    const totalMin = hourToMin + time[1];
    return totalMin;
  }
  console.log('Machine time is just minutes');
  const min = time[0];
  return min;
}

export function convertStringToNumber(string) {
  const cleanString = string.replace(/[->!< ]/g, '');
  const materialFloat = parseFloat(cleanString);
  return materialFloat;
}

export function findFootPrintPercentage(xdim, ydim) {
  const platformX = process.env.PLATFORM_X;
  const platformY = process.env.PLATFORM_Y;
  const platformArea = platformX * platformY;
  const partArea = xdim * ydim;
  const partPercentage = partArea / platformArea;
  return partPercentage;
}

export function findCost(
  machineTimeMin,
  materialUsage,
  materialName,
  partArea
) {
  const materialDollarValue = materialName === 'UMA' ? 0.16 : 0.25;
  const machinePrepTime = materialName === 'UMA' ? 5 : 20;
  console.log('materialDollarValue', materialDollarValue);
  const material = (materialUsage + materialUsage * 0.65) * materialDollarValue;
  console.log('material', material);
  const machine = 0.267 * machineTimeMin;
  console.log('machine', machine);
  const labor = (6 + machinePrepTime + 20 + 25) * 0.42 * partArea;
  console.log('labor', labor);
  const other = 3600 / (32400 / machineTimeMin);
  console.log('other', other);
  const total = material + machine + labor + other;
  return total;
}
