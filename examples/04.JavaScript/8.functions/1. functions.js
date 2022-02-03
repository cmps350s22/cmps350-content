function max (numArray) {
    //Using the spread operator to convert an array to multiple arguments
    return Math.max(...numArray);
}

console.log(max([1, 2, 3, 4, 45, 5, 6]));