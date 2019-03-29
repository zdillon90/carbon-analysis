export function UMACost(machineTime, materialUsage) {
  const material =
    (materialUsage + materialUsage * 0.15 + materialUsage * 0.5) * 0.16;
  const machine = 16 * (machineTime * 24);
  const labor = (6 + 5 + 20 + 25) * 0.42 * 0.5;
  // Change the 0.5 to be the area layout
  const other = 3600 / (540 / (machineTime * 24));
  const total = material + machine + labor + other;
  console.log(`MaTH!!! Total: ${total}`);
  return total;
}
