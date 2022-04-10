import express	from 'express';
import handlebars  from 'express-handlebars';
import router from './controllers/router.js'
import { fileURLToPath } from 'url';

const app = express();

// Return the base URL of the current file
console.log(`import.meta.url: ${import.meta.url}`);

const currentUrl = new URL('./', import.meta.url);
const currentPath = fileURLToPath(currentUrl);
console.log("currentUrl: ", currentUrl.toString(), "currentPath: ", currentPath);

//Allow serving static files from the current folder
app.use( express.static(currentPath) );

/*
 express.urlencoded extracts the entire body portion of an incoming request and assigns it to req.body.
 Parses the body text as URL encoded data (which is how browsers send form data from forms with method set to POST)
 and exposes the resulting object (containing the keys and values) on req.body.
 */
app.use( express.urlencoded({extended: true}) );
//If the body of incoming request is a json object then assign it to req.body property
app.use( express.json() );

/* Configure handlebars:
     set extension to .hbs so handlebars knows what to look for
     set the defaultLayout to 'main' so that all partial templates will be rendered and inserted in the main's {{{body}}}
     the main.hbs defines define page elements such as the menu and imports all the common css and javascript files
 */
app.engine('hbs', handlebars({defaultLayout: 'main', extname: '.hbs'}));

// Register handlebars as the view engine to be used to render the templates
app.set('view engine', 'hbs');

//Set the location of the view templates
app.set('views', `${currentPath}/views`);

app.use('/', router);

const port = 3000;
app.listen(port, () => {
    const host = "localhost";
    console.log(`App running @ http://${host}:${port}`);
});