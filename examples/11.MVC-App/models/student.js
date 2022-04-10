const gradeToPoint = new Map([
    ["A", 4],
    ["B+", 3.5],
    ["B", 3],
    ["C+", 2.5],
    ["C", 2],
    ["D+", 1.5],
    ["D", 1],
    ["F", 0]
]);

export class Student {
    constructor(studentId, firstname, lastname, program, courses) {
        this.studentId = studentId;
        this.firstname = firstname;
        this.lastname = lastname;
        this.program = program;
        this.courses = courses;
    }

    addCourse(course) {
        this.courses.push(course);
    }

    updateCourse(course) {
        let index = this.courses.findIndex(c => c.courseCode === course.courseCode);
        this.courses[index] = course;
    }

    deleteCourse(courseCode) {
        this.courses = this.courses.filter(c => c.courseCode != courseCode);
    }

    getGPA() {
        // Last reduce parameter is used to set the initial prev value to 0. First pass, prev will be 0
        let totalPoints = this.courses.reduce( (prev, curr) => prev + (gradeToPoint.get(curr.grade) * curr.creditHours) , 0 );
        let totalCredits = this.courses.reduce( (prev, curr) => prev + curr.creditHours , 0 );
        //Round to 2 decimal points
        return Math.round(totalPoints / totalCredits * 100) / 100;
    }
}
