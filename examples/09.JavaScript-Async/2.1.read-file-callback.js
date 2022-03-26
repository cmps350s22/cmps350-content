// Important traditional fs library to read/write files using callbacks
import fs from 'fs';

// Calling readFile this was will not work because it is an async function
// that expects a callback function
/*
fs.readFile('data/student.json', (err, content) => {
    const json = JSON.parse(content);
    console.log(json);
}); */

function getStudent(studentId, cb) {
    let fileContent = fs.readFile('data/student.json', function (err, data) {
        if (err) {
            cb(err);
        } else {
            const students = JSON.parse(data);
            const student = students.find( s => s.studentId == studentId);
            getProgram(student.program, function (err, programName) {
                student.program += ` - ${programName}`;
                cb(null, student);
            });
        }
    });
}

function getProgram(programCode, cb) {
    let fileContent = fs.readFile('data/ceng-programs.json', function (err, data) {
        if (err) {
            cb(err);
        } else {
            const programs = JSON.parse(data);
            const program = programs.find( p => p.code == programCode);
            cb(null, program.name);
        }
    });
}

getStudent(2015091, function (err, student) {
    if (err) {
        console.log(err);
    } else {
        console.log(student);
    }
})

