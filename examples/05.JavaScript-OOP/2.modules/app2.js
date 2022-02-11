import heroRepository from './hero-repository.js';
import {yahala} from './greeting.js';
import * as circle from './circle.js';

console.log(yahala());

const r = 4;
console.log(`The area of radius ${r}: ${circle.area(r)}
and its circumference is: ${circle.circumference(r)}`);

console.log("Hero #1:\n", heroRepository.getHero(1));
console.log("\nAll Heroes:\n", heroRepository.heroes);