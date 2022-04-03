const expect = require('chai').expect
const mongoose = require('mongoose')
const bookRepository = require('../models/BookRepository')
const Store = require('../models/storeModel')
const Book = require('../models/bookModel')

describe('BookRepository Test Suite', () => {
    let bookId
    before( async () => {
        //This makes Mongoose async operations return ES6 Promises
        mongoose.Promise = global.Promise
        await mongoose.connect('mongodb://localhost/books')
        await mongoose.connection.db.dropDatabase()
    })

    beforeEach( async () => {
    })

    afterEach( () => {
    })

    after( async () => {
        await mongoose.disconnect()
    })

    describe('Store Test Suite ', () => {

        it('should not create a store without a city', async () => {
            const store = {name: "ABC Book Store"}
            try {
                await bookRepository.addStore(store)
            }
            catch (ex) {
                expect(ex).to.have.property('message').and.equal('Store validation failed')
            }
        })

        it('should create a store and generate _id for it & StoresCount should be 1', async () => {
            let store = {name: "ABC Book Store", city: "Doha"}
            store = await bookRepository.addStore(store)
            console.log(store)
            expect( store ).to.have.property('_id')
            expect( await bookRepository.getStoresCount() ).to.equal(1)
        })

        it('should init books DB & StoresCount should be 2 and BooksCount should 5', async () => {
            await bookRepository.initDb()
            expect( await bookRepository.getBooksCount() ).to.equal(5)
            expect( await bookRepository.getStoresCount() ).to.equal(2)
        })
    })



    describe('Book Test Suite', () => {
        it('should be 3 book categories', async () => {
            const bookCategories = await bookRepository.getBookCategories()
            console.log(bookCategories)
            expect( bookCategories.length ).to.equal(4)
        })

        it('should be 2 Fun books', async () => {
            const books = await bookRepository.getBooks('Fun')
            expect( books.length ).to.equal(2)
        })

        it("title of book with isbn 234 should be 'Java 8'", async () => {
            const book = await bookRepository.getBookByIsbn('234')
            bookId = book._id
            expect( book ).to.have.property('title').and.equal('Java 8')
        })

        it(`category of book with isbn '234' should be 'Programming'`, async () => {
            const book = await bookRepository.getBook(bookId)
            expect( book ).to.have.property('category').and.equal('Programming')
        })
    })
})