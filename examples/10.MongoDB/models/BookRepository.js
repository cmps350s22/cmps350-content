import fs from 'fs-extra';
import Store from './storeModel.js';
import Book from './bookModel.js';

class BookRepository {
    constructor() {
    }

    addStore(newStore) {
        return Store.create(newStore);
    }

    getStores() {
        //Returns js objects (instead of Mongoose objects)
        return Store.find({}).select('-__v').lean();
    }

    getStoresCount(city) {
        return Store.countDocuments({ city : city});
    }

    getBookCategories() {
        return Book.distinct('category');
    }

    getBooks({category, publisherCountry}) {
        const query = Book.find({});
        //Can be const query = Book.find() or you can specify the properties to return
        //const query = Book.find({}, "_id isbn title authors publisher category pages reviews store");

        //If category is NOT undefined then addBook a where clause to the query
        if (category) {
            query.where({category: category});
        }

        //If publisherCountry is NOT undefined then addBook a where clause to the query
        if (publisherCountry) {
            query.where({ "publisher.country" : publisherCountry});
        }

        //populate('store') will replace the store Id with the corresponding store object. (add , 'name'  to only get the store name)
        query.populate('store');
        return query;
    }

    getBooksCount() {
        return Book.countDocuments({});
    }

    getBook(bookId) {
        //.select(...) is oprtional, only addBook it if you wish to specify the properties to be returned
        return Book.findById(bookId).select("isbn title authors publisher category pages reviews");
    }

    getBookByIsbn(isbn) {
        //I do not want to return the reviews and the __v (which is added automatically by MongoDB)
        return Book.findOne({isbn: isbn}).select('-reviews -__v');
    }

    //More details about query operators @ https://docs.mongodb.org/manual/reference/operator/query/
    getBooksByAuthor(author) {
        //console.log("getBooksByAuthor.author", author);
        return Book.find({authors: {$in: [author]}});
    }

    addBook(newBook) {
        return Book.create(newBook);
    }

    updateBook(updatedBook) {
        console.log('updateBook.updatedBook', updatedBook);
        const bookId = updatedBook._id;
        delete updatedBook._id; //Delete the _id if exists
        return Book.updateOne({_id: bookId}, updatedBook);

        /* Book.find({ category: 'Fun', pages : { $gt : 200 } })
        Book.find({}).sort('isbn').limit( 5 )
        Book.find({}).where({ category: 'Fun' }).or({ $lt : 100 })
        Book.find( { reviews : { $exists: true } } )*/
    }

    deleteBook(bookId) {
        return Book.deleteOne({_id : bookId});
    }

    async addReview(bookId, review) {
        const book = await this.getBook(bookId);
        if (book.reviews)
            book.reviews.push(review);
        else
            book.reviews = [review];
        return book.save();
    }

    async updateReview(bookId, reviewId, updatedReview) {
        const book = await this.getBook(bookId);
        const review = book.reviews.id(reviewId);
        review.rating = updatedReview.rating;
        review.reviewText = updatedReview.reviewText;
        return book.save();
    }

    async increaseBookPrices({category, increaseValue}) {
        await Book.find({category: category}).updateMany({$inc: {price: increaseValue}});
        return await this.getBooks({category});
    }

    async getBooksSummary() {
        return await Book.aggregate([
            // Match only books with pages >= 200
            { "$match": { "pages": {$gte : 200} } },
            { $group: {
                    _id : "$category",
                    pages: { $avg: "$pages"  },
                    count: { $sum: 1 }
                }
            },
            // Sorting by pages descending
            { "$sort": { "pages": -1 } },
            // limit results to top 5 categories with longest books
            { "$limit": 5 }
        ]);
    }

    async getBooksCountByStore(store) {
        const bookCount = await Book.aggregate([
            // Match only books with pages >= 200
            { "$match": { "store": {$in : [store]} } },
            { $group: {
                    _id : null,
                    count: { $sum: 1 }
                }
            },
        ]);
        //console.log(bookCount);
        if (bookCount) {
            //Return count property of the 1st element of the array
            return bookCount[0].count;
        }
    }

    async getStoresBooksCount() {
        //Notice that getStores returns js objects (instead of Mongoose objects)
        // using return await Store.find({}).lean().exec();
        let stores = await this.getStores();
        //console.log(stores);
        //Map the array to add booksCount attribute to each store
        stores = await Promise.all( stores.map(async store => {
            const booksCount = await this.getBooksCountByStore(store._id);
            //console.log("booksCount", booksCount);
            //Add an extra attribute before returning the store
            store.booksCount = booksCount;
            return store;
        }));
        return stores;
    }

    async emptyDB() { //in case needed during testing
        await Book.deleteMany({});
        await Store.deleteMany({});
    }

    async initDb() {
        try {
            //Uncomment to empty the database
            //await this.emptyDB();
            //If the db is empty then init the db with data in json files
            const booksCount = await this.getBooksCount();
            console.log(`Books Count: ${booksCount}. Comment out emptyDB() to stop re-initializing the database`);
            if (booksCount == 0) {
                await this.loadDataFromJsonFiles();
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    async loadDataFromJsonFiles() {
        //const store = {name: 'Jarir Bookstore', city: 'Doha'};
        const store1 = await this.addStore({name: 'Jarir Bookstore', city: 'Doha'});
        const store2 = await this.addStore({name: 'Jarir Bookstore', city: 'Istanbul'});

        const books = await fs.readJson('data/books.json');
        //const books = JSON.parse(data)

        console.log('Retrieved books from json file and added to MongoDB books Collection: ' + books.length);

        for (const book of books) {
            //Assign store1 to even and store2 to odd ISBNs
            book.store = book.isbn % 2 ? store1._id : store2._id;
            await this.addBook(book);
        }
    }
}

export default new BookRepository();