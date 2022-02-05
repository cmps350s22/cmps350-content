const multiLine = `This is an example
of a multiline string`;

console.log(multiLine);

const person = {firstName: 'Samir',  lastName:'Mujtahid'};
const fullName = `Full name: ${person.firstName} ${person.lastName}`;
console.log(fullName);

const name = "Samir Saghir";
console.log(`Hello, ${name}!`);

const priceUSD = 100;
const exchangeRate = 3.65;
console.log(`Price in QR: ${priceUSD * exchangeRate}`);

const contact = {
    firstName: "Samir",
    lastName: "Saghir",
    email: "samir@test.com",
    twitter: "@samir"
};

const html = `
    <div>
        <h1>${contact.firstName} ${contact.lastName}</h1>
        <p>Email: ${contact.email}</p>
        <p>Twitter: ${contact.twitter}</p>
    </div>
    `;

console.log(html);