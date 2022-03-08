import fs from 'fs-extra';
import { fileURLToPath } from 'url';

class HeroRepository {
    constructor() {
        const url = new URL('../data/hero.json', import.meta.url);
        this.heroFilePath = fileURLToPath(url);
    }

    async getHeroes() {
        return await fs.readJson(this.heroFilePath);
    }

    async getHero(heroId) {
        const heroes = await this.getHeroes();
        const hero = heroes.find(h => h.id == heroId);
        if (hero != "undefined") {
            return hero;
        }
        else {
            throw new Error("No record found");
        }
    }

    async addHero(hero) {
        let heroes = await this.getHeroes();
        //Get the last Id used +1
        let maxId = Math.max( ...heroes.map(h => h.id) ) + 1;
        console.log("maxId", maxId);

        hero.id = maxId;

        //console.log("heroRepository.addHero", hero)

        heroes.push(hero);
        await fs.writeFile(this.heroFilePath, JSON.stringify(heroes));
        return hero;
    }

    async updateHero(hero) {
        let heroes = await this.getHeroes();

        // Look for the hero to be updated then update it
        const foundIndex = heroes.findIndex(h => h.id == hero.id);
        //console.log("heroRepository.updateHero.foundIndex", foundIndex, hero.id)

        if (foundIndex >= 0) {
            heroes[foundIndex] = hero;
            //console.log("heroRepository.updateHero", hero)
            fs.writeFile(this.heroFilePath, JSON.stringify(heroes));
        }
    }

    async deleteHero(heroId) {
        let heroes = await this.getHeroes();

        // Look for the hero to be deleted then remove it
        const foundIndex = heroes.findIndex(h => h.id == heroId);

        if (foundIndex >= 0) {
            heroes.splice(foundIndex, 1);
            //console.log("heroController.deleteHero", heroId)
            fs.writeFile(this.heroFilePath, JSON.stringify(heroes));
        }
    }
}

export default new HeroRepository();