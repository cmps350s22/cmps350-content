//Rest Operator (3 dots ... ) allows receiving multiple arguments into an array
function sum( ...args) {
    console.log(args);
    let sum = args.reduce((prev, curr) => prev + curr);
    return sum;
}

console.log( "sum:", sum(1, 3, 5, 8, 10, 30, 40) );

//Spread Operator can also be used with destructuring assignment
let colors = ["red", "green", "blue", "yellow"];
//Extracting array elements and assigning them to variables
let [primaryColor, secondaryColor, ...otherColors] = colors;
console.log("\nprimaryColor:", primaryColor);
console.log("secondaryColor:", secondaryColor);
console.log("otherColors:", otherColors);

