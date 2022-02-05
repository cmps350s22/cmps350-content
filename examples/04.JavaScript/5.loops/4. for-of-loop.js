const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let sum = 0;
for (const n of nums) {
	sum += n;
}
console.log(`Sum of [${nums}] = ${sum}`)

console.log('-'.repeat(15));

let height = 110;
height = 120;


const student = {
	firstName: "Ali",
	lastName: "Mujtahid",
	age: 23,
	fullName: function () {
		return `${this.firstName} ${this.lastName}`;
	},
	toString: function () {
		return `Name: ${this.fullName()} \nAge: ${this.age}`
	}
};

for (const [key, value] of Object.entries(student)) {
	console.log(`${key} = ${value}`);
}
