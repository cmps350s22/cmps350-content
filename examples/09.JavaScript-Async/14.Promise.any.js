/*
What is this? Returns the first fulfilled promise regardless of other rejected promises.
If all promises reject, then reject by providing errors for all rejects.
Idiom - All's well that ends well.
Characteristic - Short-circuits when an input value is fulfilled.
 */

// Example #1
Promise.any([
    Promise.reject('✗'),
    Promise.reject('✗'),
    Promise.resolve('✓'),
    Promise.reject('✗'),
]).then(function(value) {
    console.log(`You win at life`, value)
});

// Example #2
// You get the first fulfilled value
Promise.any([
    new Promise((_, reject) => setTimeout(reject, 10, '✗')),
    new Promise((_, reject) => setTimeout(reject, 20, '✗')),
    new Promise((_, reject) => setTimeout(reject, 30, '✗')),
    new Promise(resolve => setTimeout(resolve, 100, 'I got a job!')),
    new Promise(resolve => setTimeout(resolve, 1000, 'I could have gotten a better job!')),
]).then(function(value) {
    console.log(value)
});

// Example #3
// You get all rejection reasons
Promise.any([
    Promise.reject('✗'),
    Promise.reject('✗'),
]).catch(function(reasons) {
    console.log(`Didn't get any offers...`, reasons)
});