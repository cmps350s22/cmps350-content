let fs = require('fs-extra');

let studentPromise = fs.readFile('data/student2.json');

function getStudent(studentId) {
    return fs.readJson('data/student.json').then(students => {
        let student = students.find(s => s.studentId === studentId);
        if (student != "undefined") {
            return student;
        }
        else {
            throw new Error("No records found");
        }
    });
}

function getCourses(courseIds) {
    return fs.readJson('data/course.json').then(courses => {
        courses = courses.filter(c => courseIds.indexOf(c.crn) >= 0);
        //console.log(courses);
        return courses;
    });
}

function getCourseInstructor(course) {
    return fs.readJson('data/staff.json').then(instructors => {
        course.instructor = instructors.find(ins => ins.staffNo === course.instructorId);
        delete course.instructor.password;  //No need to return the password attribute
        return course;
    });
}

//Promises chaining
function getStudentCourses(studentId) {
    let student;
    return getStudent(studentId).then(astudent => {
        student = astudent;
        return getCourses(student.courseIds);
    }).then(courses => {
        //For each course get its instructor. Do so in parrallel using Primise.all
        return Promise.all(courses.map(getCourseInstructor));
    }).then(courses => {
        student.courses = courses;
        return student;
    });
}

let studentId = 2015001;
getStudent(studentId).then(student => {
    //Displays a pretty-printed multiline JSON representation indented with 2 spaces
    console.log(JSON.stringify(student, null, 2));
}).catch(err => console.log(err));


getStudentCourses(studentId)
    .then(student => {
        console.log("\nStudent with course details: ");
        console.log(JSON.stringify(student, null, 2));
    })
    .catch(err => console.log(err));

