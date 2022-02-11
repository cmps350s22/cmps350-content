class Student {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    get fullname() {
        return `${this.name} ${this.age}`;
    }

    saySalam() {
        console.log(`Salamou Aleikoum! I am ${this.name}. I am ${this.age} years old`);
    }
}

// Add a method to a class (this can be done at runtime)
Student.prototype.toUpper = function() {
    return this.name.toUpperCase();
}
 
const juha = new Student("Juha Nasreddin", 22);
const abbas = new Student("Abbas Ibn Firnas", 25);
const samir = new Student("Samir Saghir", 17);

juha.toUpper();

console.log(`juha.name: ${juha.name}`);
console.log(`juha.fullname: ${juha.fullname}`);

juha.saySalam();
abbas.saySalam();
samir.saySalam();