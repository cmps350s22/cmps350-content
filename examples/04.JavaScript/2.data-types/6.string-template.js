let multiLine = `This is an example
of a multiline string`;

console.log(multiLine);

let person = {fname: 'Samir',  lname:'Mujtahid'};
let fullName = `Full name: ${person.fname} ${person.lname}`;
console.log(fullName);

let name = "Samir Saghir";
console.log(`Hello, ${name}!`);

let priceUSD = 100;
let exchangeRate = 3.65;
console.log(`Price in QR: ${priceUSD * exchangeRate}`);

let contact = {
    firstName: "Samir",
    lastName: "Saghir",
    email: "samir@fun.com",
    twitter: "@samir"
};

let html = `
    <div>
        <h1>${contact.firstName} ${contact.lastName}</h1>
        <p>Email: ${contact.email}</p>
        <p>Twitter: ${contact.twitter}</p>
    </div>
    `;

console.log(html);