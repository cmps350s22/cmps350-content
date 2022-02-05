let heightInMeters = 1.74;
let greeting = "Hello World!";

// Here we use an already initialized variable:
let message = greeting;

console.log(heightInMeters, greeting, message);

function divide(x, y) {
    let returnVal;
    if (y != 0) {
        returnVal = x / y;
    }
    return returnVal;
}

console.log(divide(10, 0));

/*
    let is block-scoped
*/