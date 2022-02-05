//Old way
const colors = ["red", "green", "blue", "yellow", "black"]

// Create Variables from Array
let firstColor   = colors[0]
let secondColor = colors[1]
let thirdColor  = colors[2]
let otherColors2 = [ colors[3], colors[4] ]

console.log(firstColor, secondColor, thirdColor, otherColors2);

//new way of extracting array elements and assigning them to variables => this is called Destructuring assignment
//The destructuring assignment makes it easier to extract values from arrays or objects into distinct variables
[firstColor, secondColor, thirdColor, ...otherColors2] = colors

console.log(firstColor, secondColor, thirdColor, otherColors2)

// Create elements from the array and place the remaining ones in otherColors variable using the Spread Operator
const [primaryColor, secondaryColor, ...otherColors] = colors

console.log("\nprimaryColor:", primaryColor)
console.log("secondaryColor:", secondaryColor)
console.log("otherColors:", otherColors)

//Swapping variables: Two variables values can be swapped in one destructuring expression.
//Without destructuring assignment, swapping two values requires a 3rd temporary variable
let a = 1
let b = 3

console.log("\n(a , b):", a, b);

[a, b] = [b, a]
console.log("Swapped (a , b):", a, b)

/*
 Parsing an array returned from a function:
 It's always been possible to return an array from a function. Destructuring can make working with an array return value more concise.
 */
function f() {
   return [1, 2]
}

const [x, y] = f()
console.log("\n(x, y):", x, y)

//Destructing an object
const person = {
   firstname: 'Ali', lastname: 'Faleh', age: 18, gpa: 3.6,
   address: {
      city: 'Doha',
      street: 'University St'
   }
}
const { firstname, lastname, address: {city}, ...otherDetails } = person
console.log("\n(firstname, lastname, city, otherDetails):", firstname, lastname, city, otherDetails)