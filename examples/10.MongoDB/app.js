import express from 'express';
import mongoose from 'mongoose';
import bookRepository from './models/BookRepository.js';
import router from './routes.js';

const app = express();
app.use( express.json());

//Mount the routes to the app
app.use('/api/', router);

const port = 9090; //process.env.PORT || 3000
const dbConnection = mongoose.connect('mongodb://localhost/books',
    { useNewUrlParser: true, useCreateIndex: true }, async function(err) {
    if (err) {
        console.log("Failed to connect to monogoDb " + err);
        return;
    }
    else {
        await bookRepository.initDb();

        console.log("getStoresBooksCount:");
        const stores = await bookRepository.getStoresBooksCount();
        console.log(stores);

        app.listen(port, () => {
            console.log(`Book Service running on http://localhost:${port}/api/books`);
        });
    }
});