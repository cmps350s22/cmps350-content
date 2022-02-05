/*
The Math.floor() function returns the largest integer less than or equal to a given number.
 Math.floor( 45.95); //  45
*/

let number = Math.floor((Math.random() * 10000));

while (number % 10) {
	console.log(number);
	number = Math.floor((Math.random() * 10000));
}
console.log("Using while loop - Divisible by 10 found -> " + number, "\n");

do {
   number = Math.floor((Math.random() * 10000));
   console.log(number);
} while (number % 10)

console.log("Using do loop - Divisible by 10 found -> " + number);