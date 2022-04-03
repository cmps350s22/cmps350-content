import bookRepository from '../models/BookRepository.js';

class BookService {
    async getStores(req, res) {
        const stores = await bookRepository.getStores();
        res.json(stores);
    }

    async getCategories(req, res) {
        const categories = await bookRepository.getBookCategories();
        console.log("getCategories", categories);
        res.json(categories);
    }

    async addBook(req, res) {
        const book = await bookRepository.addBook(req.body);
        res.status(201).send(book);
    }

    /*
    Example:
     {
         "author": "Soft Reviewer",
         "rating": 4,
         "reviewText": "Fun but scary book :)"
     }
    */
    async addReview(req, res) {
        const book = await bookRepository.addReview(req.params.bookId, req.body);
        res.status(200).json(book);
    }

    async updateReview(req, res) {
        const book = await bookRepository.updateReview(req.params.bookId, req.params.reviewId, req.body);
        res.status(200).json(book);
    }

    //to pass the category parameter use /api/books?category=Programming
    //to pass the isbn parameter use /api/books?isbn=123
    //to pass the isbn parameter use /api/books?author=authorName
    async getBooks(req, res) {
        let books;
        try {
            if (req.query.isbn) {
                books = await bookRepository.getBookByIsbn(req.query.isbn);
            }
            else if (req.query.author) {
                books = await bookRepository.getBooksByAuthor(req.query.author);
            } else if (req.query.increaseValue) {
                books = await bookRepository.increaseBookPrices(req.query);
            }
            else {
                books = await bookRepository.getBooks(req.query);
            }

            if (books) {
                res.status(200).json(books);
            }
            else {
                res.status(404).send('No book found');
            }
        }
        catch (err) {
            res.status(500).send(err)
        }
    }


    async getBooksSummary(req, res) {
        const books = await bookRepository.getBooksSummary();
        res.status(200).json(books);
    }

    async getBook(req, res) {
        try {
            const book = await bookRepository.getBook(req.params.bookId);
            console.log('getBook.book', book);
            if (book) {
                res.status(200).json(book);
            }
            else {
                res.status(404).send('no book found');
            }
        }
        catch (err) {
            res.status(500).send(err)
        }
    }

    async updateBook (req, res) {
        try {
            const updateResult = await bookRepository.updateBook(req.body);
            console.log("Controller.updateBook", updateResult);
            res.status(200).send("Book saved");
        } catch (err) {
            res.status(500).send(err);
        }
    }

    async deleteBook (req, res) {
        try {
            await bookRepository.deleteBook(req.params.bookId);
            res.status(204).send();
        } catch (err) {
            res.status(500).send(err);
        }
    }

    async initDb (req, res) {
        await bookRepository.initDb();
        if (res) {
            res.status(200).send('done');
        }
    }
}

export default new BookService();