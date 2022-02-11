import {Hero} from './hero.js';

class HeroRepository {
    constructor() {
        this.heroes = [
            new Hero(1, 'Muhammad Ibn `Abd Allāh', 'Prophet', 'ما كان الرفق في شيء إلا زانه ، ولا نزع من شيء إلا شانه'),
            new Hero(2, 'Abu Bakr Al-Siddiq', 'Companion', 'أيها الناس، من كان يعبد محمدا، فإن محمدا قد مات، ومن كان يعبد الله، فإن الله حي لا يموت'),
            new Hero(3, 'Umar ibn Al-Khattāb', 'Companion', 'عليك بالصدق و إن قتلك'),
            new Hero(4, 'Uthman Ibn Affan', 'Companion', 'لو أن قلوبنا طهرت ما شبعنا من كلام ربِّنا، وإني لأكره أن يأتي عليَّ يوم لا أنظر في المصحف'),
            new Hero(5, 'Ali ibn Abi Talib', 'Companion', 'من أطال الأمل أساء العمل')
        ];
    }

    addHero(newHero) {
        //Set id to last id+1
        newHero.id = this.heroes[this.heroes.length - 1].id + 1;
        this.heroes.push(newHero);
    }

    getHero(heroId) {
        return this.heroes.find(hero => hero.id == heroId);
    }
}

//Make an instance of HeroRepository available from other files
export default new HeroRepository();