import fs from 'fs-extra';
import fetch from "node-fetch";

const fetchProgram = async () => {
    const url = "https://cmps356s19.github.io/data/ceng-programs.json";
    const response = await fetch(url);
    return await response.json();

}

const readProgram = () => {
    return fs.readJson('data/cas-programs.json');
}

console.log('Promise.all start');
Promise.all([fetchProgram(), readProgram()]).then(programs => {
    //console.log(programs);
    //Flatten the array
    programs = programs.flat();
    console.log("\nPromise.all - QU Programs (CENG and CAS): ");
    console.log(programs);
});

console.log('After Promise.all');

console.log('Promise.race');
Promise.race([fetchProgram(), readProgram()]).then(programs => {
    console.log("Promise.race - Results from race of getting CAS or CENG programs: ");
    console.log(programs);
});
console.log('After Promise.race');