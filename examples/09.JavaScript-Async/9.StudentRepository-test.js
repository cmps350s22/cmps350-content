const studentRepository = require('./8.StudentRepository.async-await');

const studentId = 2015001;
studentRepository.getStudentCourses(studentId).then( response => console.log (response));