//Functions Chaining
const encode = input => input.split(' ')
    .map(str => str.toLowerCase())
    .join('-');

console.log( encode('I am happy') ); // 'i-am-happy'