import heroRepository from '../repositories/HeroRepository.js';

class HeroService {
    async getHeroes(req, res) {
        try {
            const heroes = await heroRepository.getHeroes();
            res.json(heroes);
        } catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }

    async getHero (req, res) {
        try {
            const heroId = req.params.id;
            console.log('getHero.req.params.id', heroId);
            const hero = await heroRepository.getHero(parseInt(heroId))
            console.log(JSON.stringify(hero, null, 2));
            res.json(hero);
        }
        catch (err) {
            res.status(404).send(err);
        }
    }

    async addHero(req, res) {
        try {
            let hero = req.body
            hero = await heroRepository.addHero(hero);
            const urlOfNewHero = `/api/heroes/${hero.id}`;
            res.location(urlOfNewHero);
            res.status(201).send("created");
        }
        catch (err) {
            console.log(err);
            res.status(500).send(err);
        }
    }

    async updateHero(req, res) {
        try {
            const hero = req.body;

            await heroRepository.updateHero(hero);
            res.status(200).send("ok");
        }
        catch (err) {
            res.status(500).send(err);
        }
    }

    async deleteHero(req, res) {
        try {
            const heroId = req.params.id;

            await heroRepository.deleteHero(heroId);
            res.status(200).send("ok");
        }
        catch (err) {
            res.status(500).send(err);
        }
    }
}

export default new HeroService();