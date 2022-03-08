import express from 'express';
import studentService from './services/StudentService.js';
import heroService from './services/HeroService.js';

const router = express.Router();

//Example route with multiple parameters
//Request example: authors/erradi/books/1234678g
router.get('/authors/:author/books/:isbn', (req, res) => {
    console.log(req.params.author);
    console.log(req.params.isbn);

    //This returns the received parameters as a json object
    res.json(req.params);
});

// Students Web API
router.get('/students', studentService.getStudents );
router.get('/students/:id', studentService.getStudent );

//Heroes Web API
router.route('/heroes')
    .get( heroService.getHeroes )
    .post( heroService.addHero );

router.route('/heroes/:id')
    .get( heroService.getHero )
    .put( heroService.updateHero )
    .delete( heroService.deleteHero );


router.route('/authentication').post( (req, res) => {
    const userInfo = req.body;
    console.log("router.post.req.body", userInfo);
    res.json(userInfo);
});

export { router };