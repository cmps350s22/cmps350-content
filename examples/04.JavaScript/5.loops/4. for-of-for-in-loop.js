let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
for (let element of arr) {
    console.log(element);
}
console.log("--------------------------");

function printObject(obj) {
	for (let property in obj) {
		console.log(`obj[ ${property} ] = ${obj[property]}`);
	}
}

let student = {
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

printObject(student);