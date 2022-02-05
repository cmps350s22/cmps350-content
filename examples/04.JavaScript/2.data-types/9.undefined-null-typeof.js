let x = 5;
console.log(`x = ${x}, typeof(x) is ${typeof(x)}`);

x = 3.14159;
console.log(`x = ${x}, typeof(x) is ${typeof(x)}`);

x = undefined;
console.log(`x = ${x}, typeof(x) is ${typeof(x)}`);

x = null;
console.log(`x = ${x}, typeof(x) is ${typeof(x)}`);

x = 'hello';
console.log(`x = ${x}, typeof(x) is ${typeof(x)}`);

x = new Number(5);
console.log(`x = ${x}, typeof(x) is ${typeof(x)}`);

x = {firstName: 'Samir',  lastName:'Mujtahid'};
console.log(`x = ${JSON.stringify(x)}, typeof(x) is ${typeof(x)}`);