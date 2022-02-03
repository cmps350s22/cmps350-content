let nums = [1, 2, 3];
let total = nums
    .map(x => x * 2)
    .reduce((sum, x) => sum + x);

console.log('sum = ', total);

let filtered = [12, 5, 8, 130, 44].filter( e => e > 10 );
// filtered is [12, 130, 44]

console.log('GreaterThan10: ', filtered.join(', '));