import express from 'express';
import {fileURLToPath} from 'url';
import heroRespository from './repositories/HeroRepository.js';


const app = express();
/*  express.json() is a middleware function that extracts the body portion of an incoming request and assigns
    it to req.body. without this line req.body will be undefined
 */
app.use( express.json() );

//Allow serving static files from public folder
app.use( express.static('public') );

app.get('/', (req, res) => {
    const resText = `السلام عليكم ورحمة الله وبركاته
        <br><a href="heroes">Heroes</a>
        <br><a href="quote">Quote</a>
        <br><a href="cats.jpg">Cats</a>`;

    res.send(resText);
});



app.get('/quote', (req, res) => {
    const url = new URL('./public/quote.txt', import.meta.url);
    console.dir(url.toString());
    res.sendFile( fileURLToPath(url) );
    /*console.dir(import.meta.url);
    console.dir(fileURLToPath(import.meta.url));
    console.dir(path.dirname(fileURLToPath(import.meta.url)));
    const __dirname = path.dirname(fileURLToPath(import.meta.url));*/
});

app.get('/heroes', async (req, res) => {
    let heroes = await heroRespository.getHeroes();
    res.json(heroes);
});

app.post('/heroes', async (req, res) => {
    let hero = req.body;
    await heroRespository.addHero(hero);
    res.sendStatus(201);
});

app.get('/heroes/:id', async (req, res) => {
    //req.params: This property is an object containing properties mapped to the named route parameters
    //For example, if you have the route /users/:id, then the “id” property is available as req.params.id
    let heroId = req.params.id;
    console.log(heroId);
    let hero = await heroRespository.getHero(heroId);
    console.log(hero);
    res.json(hero);
});

app.get('/*', (req, res) => {
    res.status(404).send('Not found');
});

const port = 4000;
app.listen(port, () => {
    const host = "localhost";
    console.log(`App is running and available @ http://${host}:${port}`);
});