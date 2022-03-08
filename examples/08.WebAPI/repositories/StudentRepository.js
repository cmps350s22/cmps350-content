import fs from 'fs-extra';
import { fileURLToPath } from 'url';

class StudentRepository {
    constructor() {
        this.studentFilePath = fileURLToPath(new URL('../data/student.json', import.meta.url));
        this.courseFilePath = fileURLToPath(new URL('../data/course.json', import.meta.url));
        this.staffFilePath = fileURLToPath(new URL('../data/staff.json', import.meta.url));
    }

    async getStudents() {
        return await fs.readJson(this.studentFilePath);
    }

    async authenticate(username, password) {
        const users = await this.getUsers();
        const user = users.find(s => s.username === username && s.password === password);
        if (user != "undefined") {
            return user;
        }
        else {
            throw new Error("Authentication failed");
        }
    }

    async getStudent(studentId) {
        let students = await this.getStudents();
        let student = students.find(s => s.studentId === studentId);
        if (student != "undefined") {
            return student;
        }
        else {
            throw new Error("No records found");
        }
    }

    async getCourses(courseIds) {
        const data = await fs.readFile(this.courseFilePath);
        let courses = JSON.parse(data);
        courses = courses.filter(c => courseIds.indexOf(c.crn) >= 0);
        //console.log(courses)
        return courses;
    }

    async getInstructor(instructorId) {
        const data = await fs.readFile(this.staffFilePath);
        const instructors = JSON.parse(data);
        const instructor = instructors.find(ins => ins.staffNo === instructorId);
        delete instructor.password; //No need to return the password attribute
        //console.log(instructor);
        return instructor;
    }

    async getStudentCourses(studentId) {
        const student = await this.getStudent(studentId);
        const courses = await this.getCourses(student.courseIds);
        //Get instructor details for each course
        for(const course of courses) {
            course.instructor = await this.getInstructor(course.instructorId);
        }

        student.courses = courses;
        return student;
    }
}

export default new StudentRepository();