import {greet} from './module1.js';

function getGreeting () {
    const element = document.createElement('div');
    element.innerHTML = greet();
    return element;
}

console.log(">> from app2.js");
document.body.appendChild( getGreeting() );