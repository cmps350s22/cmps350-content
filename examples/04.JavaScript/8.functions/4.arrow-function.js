const nums = [1, 2, 3];
const total = nums
    .map(n => n * 2)
    .reduce((sum, n) => sum + n);

console.log('sum = ', total);

const filtered = [12, 5, 8, 130, 44].filter( n => n > 10 );
// filtered is [12, 130, 44]

console.log('GreaterThan10: ', filtered.join(', '));