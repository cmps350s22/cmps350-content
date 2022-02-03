let nums = [1, 2, 3, 4, 5, 6, 7, 8];
let squaredEvenNums = [];
for (const num of nums) {
    if (num % 2 === 0) {
        squaredEvenNums.push(num ** 2);
    }
}
console.log("squaredEvenNums:", squaredEvenNums);

//Get even numbers then square them. This is an example of Chaining!
nums = [1, 2, 3, 4, 5, 6, 7, 8];
squaredEvenNums = nums.filter( n => n % 2 == 0 )
                      .map(n => n ** 2);
console.log("squaredEvenNums:", squaredEvenNums);
// [ 1, 9, 25, 49 ]

//Compute the sum using the reduce function
let total = nums.reduce( (sum, n) => sum + n );
// See details of the computation
total = nums.reduce( (sum, n) => {
     console.log(sum, n)
     return sum + n
    });
console.log("Sum of array elements: ", total);

//Flatten the array: transform from 2D array to a simple array
let flattened = [[0, 1], [2, 3], [4, 5]].reduce( ( acc, cur ) => acc.concat(cur) );
console.log("flattened array:", flattened);

// Better way
flattened = [[0, 1], [2, 3], [4, 5]].flat()
console.log("flattened array:", flattened);

flattened = [['a', 'b', 'c'], ['d', 'e']].flat()
//flattened array: [ 'a', 'b', 'c', 'd', 'e' ]
console.log("flattened array:", flattened);