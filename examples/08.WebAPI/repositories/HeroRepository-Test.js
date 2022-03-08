import heroRepository from './HeroRepository.js';

heroRepository.getHeroes().then(heroes => {
    console.log(heroes);
}).catch( err => console.log(err) );

let heroId = 1;
heroRepository.getHero(heroId).then(hero => {
    console.log(hero);
}).catch( err => console.log(err) );

