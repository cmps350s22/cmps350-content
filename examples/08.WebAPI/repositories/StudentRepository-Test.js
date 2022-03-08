import studentRepository from './StudentRepository.js';

studentRepository.getStudents().then(students => {
    console.log( "Students count: ", students.length);
}).catch( err => console.log(err) );

let studentId = 2015002
studentRepository.getStudentCourses(studentId).then(student => {
    console.log(  student );
}).catch( err => console.log(err) );

