import fs from 'fs-extra';

class StudentRepository {

    async getStudent(studentId) {
        const students = await fs.readJson('data/student.json');
        const student = students.find(s => s.studentId === studentId);
        if (student != "undefined") {
            return student;
        }
        else {
            throw new Error("No records found");
        }
    }

    async getCourses(courseIds) {
        let courses = await fs.readJson('data/course.json');
        courses = courses.filter(c => courseIds.indexOf(c.crn) >= 0);
        //console.log(courses);
        return courses;
    }

    async getCourseInstructor(course) {
        //const fs = require('fs-extra');
        const instructors = await fs.readJson('data/staff.json');
        course.instructor = instructors.find(ins => ins.staffNo === course.instructorId);
        delete course.instructor.password;  //No need to return the password attribute
        return course;
    }

    // create a new "async" function so we can use the "await" keyword
    async getStudentCourses(studentId) {
        const student = await this.getStudent(studentId);
        const courses = await this.getCourses(student.courseIds);
        //Get instructor details for each course. Promise.all allows doing so in parallel.
        // The commented statement below is equivalent to the one used under itf
        //student.courses = await Promise.all( courses.map( c => this.getCourseInstructor(c) ) );
        student.courses = await Promise.all( courses.map( this.getCourseInstructor ) );

        return student;
    }
}

module.exports = new StudentRepository();