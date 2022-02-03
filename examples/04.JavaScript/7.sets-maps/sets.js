let names = new Set();
names.add('Samir');
names.add('Fatima');
names.add('Mariam');
names.add('Ahmed');
names.add('Samir'); // won't be added

for (let name of names) {
    console.log(name);
}

let namesArray = Array.from(names);
console.log("numbersArray:", namesArray);