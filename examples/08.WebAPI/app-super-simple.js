import express from 'express';
import heroRepo from './repositories/HeroRepository.js';

const app = express();

/*  express.json() is a middleware function that extracts the body portion of an incoming request and assigns
    it to req.body. without this line req.body will be undefined
 */
app.use( express.json() );

app.get('/', (req, res) => {
    res.send('Welcome to Super Simple App!');
});

app.get('/salam', (req, res) => {
    res.send('السلام عليكم ورحمة الله وبركاته');
});

app.get('/time', (req, res) => {
    const datetime = new Date();
    res.send(datetime);
});

app.get('/heroes', async (req, res) => {
    const heroes = await heroRepo.getHeroes();
    res.json(heroes);
});

app.get('/heroes/:heroId', async (req, res) => {
    const heroId = req.params.heroId;
    const hero = await heroRepo.getHero(heroId);
    if (hero) {
        res.json(hero);
    } else {
        res.status(404).send(`Hero ${heroId} not found`);
    }
});

//Try this using http://localhost:5566/posts/2019/03?sortBy=createdOnDate
app.get('/posts/:year/:month', async (req, res) => {

    //req.params: This property is an object containing properties mapped to the named path parameters
    //For example, if you have the route /users/:id, then the “id” property is available as req.params.id

    //req.query: This property is an object containing a property for each query string parameter in the route.
    // If you have the path /posts?sortBy=createdOnDate, then the “sortBy” property is available as req.query.sortBy
    // req.query.sortBy  => "createdOnDate"
    const response = {params: req.params, query: req.query};
    //This returns the received parameters and query string as a json object
    res.json(response);
});

app.post('/heroes', async (req, res) => {
    try {
        let hero = req.body
        hero = await heroRepo.addHero(hero);
        const urlOfNewHero = `/heroes/${hero.id}`;
        res.location(urlOfNewHero);
        res.status(201).send("created");
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

});

const port = 5566;
app.listen(port, () => {
    const host = "localhost";
    console.log(`App is running and available @ http://${host}:${port}`);
});