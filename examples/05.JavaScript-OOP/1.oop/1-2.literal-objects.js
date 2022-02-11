const person = {
    firstName: 'Samir',
    lastName: 'Saghir',
    height: 54,
    name()
      	{
            return `${this.firstName}  ${this.lastName}`;
        },

    makeCoffee: function() {
        console.log('☕');
    }
};

//Two ways to access the object properties
console.log("person['height'] === person.height ? ", person['height'] === person.height);
console.log(person.name());
person.makeCoffee();

//Serialise the object to a string in JSON format -- only attributes getr serialised
const jsonString = JSON.stringify(person);
console.log('Person json string: ', jsonString);

//Deserialise a JSON string to an object
//Create an object from a string!
//More info @ https://developer.mozilla.org/en-US/docs/JSON
const personObject = JSON.parse(jsonString);
console.log('Person object: ', personObject);

const person2 = {
    name: 'Samir Saghir',
    address: {
        city: 'Doha',
        street: 'University St'
    }
};
//object destructring example
const { name, address: {city} } = person2;
console.log( { name, city });
