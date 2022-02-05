function square(x) {
    return x * x;
}

const display = (x) => {
    console.log(x);
}

display('Cool!');

//Map applies a function to every element of the nums
const numbers  = [1, 2, 3, 4, 4, 5, 6, 7, 8, 9, 10];
let squares = numbers.map( square );

squares.forEach( display );


//2nd way
squares = numbers.map(function(x) {
    return x * x;
});

//3rd way using arrow functions
squares = numbers.map(x => x * x);

const roots = numbers.map(Math.sqrt);

console.log('num - square - sqrt ');
for (const index in numbers) {
    console.log(numbers[index] + ' - ' + squares[index] + ' - ' + roots[index])
}

function logArrayElement(element, index) {
    console.log("a[" + index + "] = " + element);
}

//Similar to numbersMap method
[2, 5, 9].forEach(logArrayElement);

//reduce method can be used to arrgegate the elements of the nums
const total = [0, 1, 2, 3].reduce((total, e) => total + e);
console.log('Total = ' , total); // sum == 6

//Flatten an nums of arrays
const flattened = [[0, 1], [2, 3], [4, 5]].reduce((a, b) => a.concat(b));

//Concatenate the elements of an nums
console.log('flattened ', flattened.join(', ')); // flattened is [0, 1, 2, 3, 4, 5]