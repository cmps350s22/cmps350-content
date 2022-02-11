//watch this demo http://www.youtube.com/watch?v=giJV6boOLxU
const dog = {
    eyes: 2,
    legs: 4,
    type: "Animal",
    toString() {
        return `${this.type} with ${this.eyes} eyes and ${this.legs} legs.`
    }
}

const myDogMax = Object.create(dog);
console.log('myDogMax: ', myDogMax);

//Add a new property to myDogMax object.
//These new properties will be available in spotDog because it inherits from myDogMax
myDogMax.name = "Max";
myDogMax.age = 3;
myDogMax.speak = function() {
        console.log(`${this.name}.speak... Woof, Woof`);
}

myDogMax.speak();
console.log();

const spotDog = {
    name: 'Spotty',

    //extra properties
    color: 'White',
    pattern: 'Spots',
    patternColor: 'Black',
    weight: 22,
    eat () {
        console.log(`${this.name}.eat... Yum, Yum`);
    }
}


Object.setPrototypeOf(spotDog, myDogMax);

//spotDog object inherited the static and dynamic properties from myDogMax object
console.log('spotDog.name: ', spotDog.name);
console.log('spotDog.age: ', spotDog.age);
spotDog.speak();
console.log('spotDog.toString(): ', spotDog.toString());
console.log();

//The derived object can add its own properties and methods
console.log('spotDog: ', spotDog);
spotDog.eat();

console.log();
console.log('spotDog.__proto__ : ', Object.getPrototypeOf(spotDog) );
console.log('myDogMax.__proto__ : ', Object.getPrototypeOf(myDogMax));
console.log('dog.__proto__ : ', Object.getPrototypeOf(dog));