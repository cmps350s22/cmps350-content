// What’s the average age of employees working in Doha?
let employees = [
    {name: "Sara Faleh", city: "Doha", age: 30},
    {name: "Mariam Saleh", city: "Istanbul", age: 22},
    {name: "Ali Maleh", city: "Doha", age: 24}
];
let dohaEmployees = employees.filter (e => e.city == "Doha");
console.log(dohaEmployees);
let avgAge = dohaEmployees.map( e => e.age).reduce( (sum, age) => sum + age ) / dohaEmployees.length;
console.log("avgAge: " + avgAge);
