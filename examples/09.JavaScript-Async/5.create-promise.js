let request = require('request');

//Create a Promise to wrap an old callback-based api with a model promise.
function getQuote() {
    return new Promise( (resolve, reject) => {
        let url = 'http://ron-swanson-quotes.herokuapp.com/v2/quotes';
        request(url, (err, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(response.body));
            }
        });
    });
}

getQuote().then( quote => {
    console.log("Quote: ", quote);
}).catch(err => console.log(err));

/* You may modify this example to try other Web APIs
 https://maps.googleapis.com/maps/api/geocode/json?address=Aspire%20Zone
 https://www.googleapis.com/books/v1/volumes?q=isbn:0747532699
 https://docs.openaq.org/ (An API for open air quality data)
*/

// Creates a promise that will be resolved after a specified milliseconds
function timeout(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

console.log("This message is displayed immediately");

// Consumer gets a promise, is notified when the promise is resolved
let promise = timeout(2000);
promise.then(() => console.log("Displayed after 2 second"));