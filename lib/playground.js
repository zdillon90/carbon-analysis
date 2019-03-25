const string =
  '<div>Part and support volume</div><div><!-- react-text: 677 -->2.1<!-- /react-text --><!-- react-text: 678 --> ml<!-- /react-text --></div>';

// const numbers = string.match(/\d+/g).map(Number);
const numbers = string.substring(63, 66);
console.log(numbers);
