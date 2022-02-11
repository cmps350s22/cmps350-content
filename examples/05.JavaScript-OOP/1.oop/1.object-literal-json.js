const person = {
    firstName: "Salaheddine",
    lastName: "Al-Ayoubi",
    id: 123,

    get fullName () {
        return `${this.firstName} ${this.lastName}`;
    },

    getFullName () {
            return `${this.firstName} ${this.lastName}`;
    }
};

console.log(person.firstName);

console.log(person.fullName);

console.log(person.getFullName());

//Person 2 example
const person2 = {};
person2.firstName = "Salaheddine";
person2.lastName = "Al-Ayoubi";
person2.age = "20" ;
person2.getFullName = function () {
    return `${this.firstName} ${this.lastName}`;
}

console.log(person2.getFullName(), "\n");

//Student Example
const name = "Fahim Mujtahid";
const courses = [
    { courseCode: 'CMPS151', grade: 'A' },
    { courseCode: 'CMPS152', grade: 'B' },
    { courseCode: 'CMPS251', grade: 'B+' },
    { courseCode: 'CMPS356', grade: 'A' }
  ];

const student = {
    name,
    courses,

    toString() {
        let msg = `${this.name} \n`;

        this.courses.forEach(course =>
            msg += `${course.courseCode} : ${course.grade}\n`
        );
        return msg;
    }
};

console.log(student.toString());
courses[2].grade = 'C';
console.log(student.toString());
