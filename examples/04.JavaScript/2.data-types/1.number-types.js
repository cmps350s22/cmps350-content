let PI = Math.PI; // 3.141592653589793
console.log("PI = " + PI);

let minValue = Number.MIN_VALUE;
console.log("Number.MIN_VALUE = " + minValue);

let maxValue = Number.MAX_VALUE;
console.log("Number.MAX_VALUE = " + maxValue);

let div0 = PI / 0; // Infinity
console.log("PI / 0 = " + div0);

let divMinus0 = -PI / 0; // -Infinity
console.log("-PI / 0 = " + divMinus0);

let nan = div0 / divMinus0; // NaN
console.log("Infinity / -Infinity = " + nan);

let eps = Number.EPSILON;
console.log("Number.EPSILON = " + eps);

console.log("");

let a = 0.1;
let b = 0.25;
let sum = 0.3;
let equal = (a + b == sum); // false

console.log("a = " + a);
console.log("b = " + b);
console.log("a+b = " + (a + b));
console.log("sum = " + sum);
console.log("sum == a+b? is " + equal);