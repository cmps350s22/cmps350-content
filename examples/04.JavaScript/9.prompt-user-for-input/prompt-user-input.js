import promptSync from 'prompt-sync';
const prompt = promptSync();

// get input from the user.
let age = prompt('Your age? ');
console.log(age);