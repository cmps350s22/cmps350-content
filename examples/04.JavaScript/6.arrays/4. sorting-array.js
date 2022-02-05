const numbers = [5, 4, 23, 2];

function orderBy(a, b) {
    //return (a == b) ? 0 : (a > b) ? 1 : -1;
    return b - a;
};

//Alphabetical Sort
numbers.sort();
console.log("Alphabetical Sort:", numbers.join(", "));

//a - b could be negative, zero, positive
// a - b < 0 => a comes before b in the answer
// a - b > 0 => b comes before a in the answer
// a - b = 0 => order of a and b remains unchanged
numbers.sort((a, b) => a - b);
console.log("Sorted ascending:", numbers.join(", "));

numbers.sort( (a, b) => b - a );
console.log("Sorted descending:", numbers.join(", "));