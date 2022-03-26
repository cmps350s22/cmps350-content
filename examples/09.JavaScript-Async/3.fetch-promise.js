import fetch from "node-fetch";

function getStudents() {
    let url = "https://cmps356s19.github.io/data/student.json";
    return fetch(url).then(response => response.json())
                     .catch(err => console.log(err));
}

function displayStudents(students) {
    console.log("Students List: ")
    for(let student of students) {
        console.log(`${student.studentId} - ${student.firstname} ${student.lastname}`);
    }
}

getStudents().then( students => displayStudents(students) )
             .catch( err => console.log(err) );