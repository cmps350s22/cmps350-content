console.log("----------------------------------------------------");
console.log("Regular comparisons: ");
let a = 5;
let b = 4;

console.log("a = " + a + ", b = " + b);
console.log("(a >= b)  = " + (a >= b)); // True
console.log("(a != b)  = " + (a != b)); // True
console.log("(a == b)  = " + (a == b)); // False
console.log("(a == a)  = " + (a == a)); // True
console.log("(a != ++b) = " + (a != ++b)); // False
console.log("(a > b)   = " + (a > b));  // False

console.log("----------------------------------------------------");
console.log("Special comparisons: ");
let zeroInt = 0;
let oneInt = 1;

let zeroFloat = 0.0;
let oneFloat = 1.0;

let emptyStr = "";
let oneStr = "1";
let str = "JavaScript";

let nullValue = null;
let emptyObject = {};

console.log('0 == 0.0 = ' + (zeroInt == zeroFloat));
console.log('1 == "1" =' + (oneInt == oneStr));
console.log('1 === "1" =' + (oneInt === oneStr));


console.log('0 == "" = ' + (zeroInt == emptyStr));
console.log('0 === "" = ' + (zeroInt === emptyStr));

console.log('nullValue == emptyStr = ' + (nullValue == emptyStr));