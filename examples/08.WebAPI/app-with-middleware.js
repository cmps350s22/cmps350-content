import express from 'express';
const app = express();

//Define a middleware function
function logger (req, res, next) {
    req.requestTime = new Date();
    console.log(`Request received from '${req.hostname}' at ${req.requestTime}`);
    next();
}

function authenticate (req, res, next) {
    const userName = req.query.userName;
    const password = req.query.password;
    if (userName == 'Admin' && password =='AdminAdmin') {
        next();
    } else {
        res.send("Authentication failed!");
    }
}

// Attach it to the app  ... logger function is called a middleware  ... seats between the request and request handler
app.use( logger );
app.use( authenticate );

app.get('/', (req, res) => {
    const resText = `السلام عليكم ورحمة الله وبركاته<br>
        Requested at: ${req.requestTime}`;
    res.send(resText);
});

const port = 5000;
app.listen(port, () => {
    const host = "localhost";
    console.log(`App is running and available @ http://${host}:${port}`);
});