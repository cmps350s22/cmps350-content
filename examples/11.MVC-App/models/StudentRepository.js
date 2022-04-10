import { Student } from './student.js'
import { Course } from './course.js';

class StudentRepository {
    constructor() {
        this.students = [
            new Student(123, "Abas", "Ibn Firas", "CS",
                [
                    new Course("CMPS151", "Progamming Concepts", 3, "Spring 2016", "A"),
                    new Course("CMPS152", "Progamming Concepts Lab", 1, "Spring 2016", "B"),
                    new Course("CMPS251", "OO Programming", 3, "Spring 2016", "B+"),
                    new Course("CMPS252", "OO Programming Lab", 1, "Spring 2016", "A")
                ]
            ),
            new Student(234, "John", "Dahak", "CS",
                [
                    new Course("CMPS251", "OO Programming", 3, "Spring 2016", "D+"),
                    new Course("CMPS252", "OO Programming Lab", 3, "Spring 2016", "D+"),
                    new Course("CMPS351", "Web Development", 3, "Spring 2016", "C"),
                    new Course("CMPS352", "Web Development", 3, "Spring 2016", "F")
                ]
            ),
            new Student(345, "Fatima", "Al Fihiri", "CE",
                [
                    new Course("CMPS151", "Programming Concepts", 3, "Spring 2016", "C"),
                    new Course("CMPS152", "Programming Concepts Lab", 3, "Spring 2016", "A"),
                    new Course("CMPS251", "OO Programming", 3, "Spring 2016", "B+"),
                    new Course("CMPS252", "OO Programming lab", 3, "Spring 2016", "C+")
                ]
            ),
            new Student(456, "Zaynab", "Al Kindi", "CE",
                [
                    new Course("CMPS251", "OO Programming", 3, "Spring 2016", "A"),
                    new Course("CMPS252", "OO Programming Lab", 1, "Spring 2016", "B+"),
                    new Course("HIS101", "History ", 2, "Spring 2016", "B"),
                    new Course("CMPE300", "Robotics ", 3, "Spring 2016", "D+")
                ]
            )

        ];
    }

    getStudents() {
        return this.students;
    }

    addStudent(student) {
        this.students.push(student);
    }

    updateStudent(student) {
        let index = this.students.findIndex(s => s.studentId == student.studentId);
        this.students[index] = student;
    }

    deleteStudent(studentId) {
        let index = this.students.findIndex(s => s.studentId == studentId);
        this.students.splice(index, 1);
    }

    getStudent(studentId) {
        return this.students.find(s => s.studentId == studentId);
    }

    getAvgGPA() {
        let totalStudentGPA = this.students.reduce((prev, curr) => prev + curr.getGPA(), 0);
        return totalStudentGPA / this.students.length;
    }

    getTop2Student() {
        let sortedStudents = this.students.sort((a, b) => a.getGPA() - b.getGPA());
        return [sortedStudents[0], sortedStudents[1]];
    }
}

export default new StudentRepository();
