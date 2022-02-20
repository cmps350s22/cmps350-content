// Expression interpolation
const a = 5, b = 10;
console.log(`${a} + ${b} = ${a + b}`);

// Conditional expression
const isHappy = true;
const state = `${ isHappy ? '😀' : '😢'}`;
console.log(state);

// Loop
const  days = ["Mon", "Tue", "Wed", "Thurs", "Fri", "Sat", "Sun"];
const daysHtml = `<ul>
   ${days.map(day => `<li>${day}</li>`).join('\n')}
</ul>`;
console.log(daysHtml);

// HTML Template
const person = {
    name: 'Mr Bean',
    job: 'Comedian',
    hobbies: ['Make people laugh', 'Do silly things', 'Visit interesting places']
}

const personTemplate = ({name, hobbies, job}) =>
    `<article class="person">
       <h3>${name}</h3>
       <p>Current job: ${job}</p>
       <div>
           <div>Hobbies:</div>
           <ul>
               ${hobbies.map(hobby => `<li>${hobby}</li>`).join(" ")}
           </ul>
       </div>
    </article>`;

const personHtml = personTemplate(person);
// document.body.innerHTML = personHtml; // to display it on the browser
console.log(personHtml);

const payment = {
    date: '1/2/2021',
    name: 'Mr Bean',
    amount: 200,
    reason: 'Donation',
    receiver: 'Juha'
}

const receiptTemplate = (payment) =>
    `<div>
      <p>Date: ${payment.date}</p>
      <p>Received from: ${payment.name}, the amount of QR ${payment.amount}</p>
      <p>For: ${payment.reason}</p>
      <p>Received by: ${payment.receiver}</p>
    </div>`

console.log(receiptTemplate(payment));
// Render the template in the DOM
document.body.innerHTML = receiptTemplate(payment);

