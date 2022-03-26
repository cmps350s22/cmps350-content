let promise = new Promise( resolve => {
    resolve(1);
});

promise.then( val => {
    console.log(val); // 1
    return val + 2;
}).then( val => {
    console.log(val); // 3
});