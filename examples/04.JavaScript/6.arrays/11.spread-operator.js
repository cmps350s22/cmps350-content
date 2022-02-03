let numArray = [1, 4, 50, 60, 3];
console.log(numArray.join(","));
let maxVal = Math.max(...[1, 5, 6.6, 7, 8]); //Math.max(...numArray);
console.log(maxVal);


let cold = ['autumn', 'winter'];
let warm = ['spring', 'summer'];

let seasons = ["Cool!", ...cold, ...warm, "Super Hot Summer"];
console.log(seasons);

/*
//The Spread Operator (3 dots ... ) allows converting an array into multiple arguments
let nums = [5, 4, 23, 2];
//This function call will return a NaN because it expect multiple arguments not an array (such as Math.max(5, 4, 23, 2);)
let max = Math.max(nums);
console.log("max:", max);

//Spread Opertaor could be used to convert the array into multiple arguments
max = Math.max(...nums);
console.log("max:", max);

//Concatenate arrays using Spread Operator
let parts = ['shoulders', 'knees'];
let body = ['head', ...parts, 'toes', 'face'];
console.log(body.join(", "));

let cold = ['autumn', 'winter'];
let warm = ['spring', 'summer'];
// construct an array
let seasons = [...cold, ...warm]; // => ['autumn', 'winter', 'spring', 'summer']

console.log(seasons);

    */