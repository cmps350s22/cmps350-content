let arr = [1, 2, 3, 4, 5];
console.log("arr = " + arr.join(", "));

//This way is rarely used
let arr2 = new Array(10);
console.log("arr2 = " + arr2.join(", "));
console.log("arr2[2] = " + arr2[2]);

let weekDays = ["Monday", "Tuesday", "Wednesday",
	"Thursday", "Friday", "Saturday", "Sunday"]

console.log("weekDays = " + weekDays.join(", "));

let mixedArr = [1, new Date(), "hello"];
console.log("mixedArr = " + mixedArr.join(", "));

let capitals = ["Doha", "Cairo", "London", "Paris"];
for (let capital of capitals) {
	console.log(capital);
}