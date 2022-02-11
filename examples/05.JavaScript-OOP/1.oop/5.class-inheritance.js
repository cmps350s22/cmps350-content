class Person {
    constructor(firstname, lastname){
        this.firstname = firstname;
        this.lastname = lastname;
    }

    get fullname() {
        return `${this.firstname} ${this.lastname}`;
    }

    set fullname(fullname) {
        [this.firstname, this.lastname] = fullname.split(" ");
    }

    greet() {
        return `Hello, my name is ${this.fullname}`;
    }
}

class Student extends Person {
    constructor(firstname, lastname, gpa){
        super(firstname, lastname);
        this.gpa = gpa;
    }
    greet() {
        return `${super.greet()}. My gpa is ${this.gpa}`;
    }
}

const student1 = new Student("Ali", "Faleh", 3.5);
student1.fullname = "Ali Saleh";
console.log(student1.greet());