const arr = [1, 2, 3, 4, 5];
console.log("arr = " + arr.join(", "));

const weekDays = ["Monday", "Tuesday", "Wednesday",
	"Thursday", "Friday", "Saturday", "Sunday"]

console.log("weekDays = " + weekDays.join(", "));

const mixedArr = [1, new Date(), "hello"];
console.log("mixedArr = " + mixedArr.join(", "));

const capitals = ["Doha", "Cairo", "London", "Paris"];
for (const capital of capitals) {
	console.log(capital);
}