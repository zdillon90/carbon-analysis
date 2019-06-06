export default function sleep(s) {
  const ms = s * 1000;
  return new Promise(resolve => setTimeout(resolve, ms));
}
