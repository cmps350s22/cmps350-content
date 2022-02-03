let array = [1, 2, 3, 4, 5];

// Get nums size
let length = array.length;

// Declare and create the reversed nums
let reversed = new Array(length);

// Initialize the reversed nums -- never do this. Use .reverse() function instead
for (let index = 0; index < length; index++) {
	reversed[length - index - 1] = array[index];
}

console.log("nums = [" + array.join(", ") + "]");
console.log("reversed = [" + reversed.join(", ") + "]");

console.log("Simpler way! reversed = [" + array.reverse().join(", ") + "]");