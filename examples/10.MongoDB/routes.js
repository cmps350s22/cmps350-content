import express from 'express';
import bookService from './services/BookService.js';

const router = express.Router();
router.get('/books/initdb', bookService.initDb );

router.get('/stores', bookService.getStores );
router.get('/categories', bookService.getCategories );

router.get('/books', bookService.getBooks );
router.get('/books/:bookId', bookService.getBook );

router.post('/books', bookService.addBook );
router.post('/books/:bookId/reviews', bookService.addReview );

router.put('/books/:bookId', bookService.updateBook );
router.put('/books/:bookId/reviews/:reviewId', bookService.updateReview );
router.delete('/books/:bookId', bookService.deleteBook );

router.get('/reports/summary/', bookService.getBooksSummary );

export default router;