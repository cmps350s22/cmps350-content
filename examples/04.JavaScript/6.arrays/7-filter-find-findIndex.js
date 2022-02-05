const students = [
    {
        name : "Ahmed",
        course : "CMPS 151"
    },
    {
        name : "Ahmed",
        course : "CMPS 251"
    },
    {
        name : "Samira",
        course : "CMPS 151"
    },
];

let cmps151Students = students.filter( s => s.course !== "CMPS 251");

//use filter to find all
cmps151Students = students.filter( s => s.course === "CMPS 151");
console.log( "cmps151Students:", cmps151Students );

//First CMPS 151 student
const firstStudent = students.find((s) => s.course === "CMPS 151");
console.log( "firstStudent found:", firstStudent );

//Index of First CMPS 151 student
const studentIndex = students.findIndex((s) => s.course === "CMPS 151");
console.log( "studentIndex:", studentIndex );

students.splice(studentIndex, 1);

console.log( students );