const student = {
    firstname: 'Samir',
    lastname: 'Saghir',
    age: '18',
    gpa: 3.6,
    address: {
        city: 'Doha',
        street: 'University St'
    }
};

const { firstname, address: {city}, ...otherDetails} = student;
console.log(firstname, city, otherDetails);
