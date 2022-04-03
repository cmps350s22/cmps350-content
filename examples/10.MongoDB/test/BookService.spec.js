//Require the dev-dependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

chai.use(chaiHttp)

describe('Book Service Test Suite', () => {
    let bookId

    before( async () => {
        //initialize the database to make the test suite repeatable
        await chai.request('http://localhost:9090').get('/api/books/initdb')
    })

    //More info @ http://chaijs.com/plugins/chai-http/
    it('it should return 200 ok and an array of 5 objects', async () => {
        const response = await chai.request('http://localhost:9090').get('/api/books')
        expect(response).to.have.status(200)
        expect(response).to.have.property('body').and.be.a('array')
        expect(response.body).to.have.property('length', 5)
    })

    it('it should return 201 and return a book that has an _id property', async () => {
        const newbook =   {
            "isbn" : "444",
            "title": "JS Testing using Mocha Programming",
            "authors": ["Khadija Kawari", "Samir Faleh"],
            "publisher": {"name": "ABC Books Co", "country": "UAE"},
            "category": "Web Programming",
            "pages": 300
        }

        const response = await chai.request('http://localhost:9090').post('/api/books').send(newbook)
        //console.log(response)
        bookId = response.body._id
        expect(response).to.have.status(201)
        expect(response).to.be.json
        expect(response.body).to.have.property('_id')
    })

    it('it should return 204 and delete the book', async () => {
        const response = await chai.request('http://localhost:9090').delete(`/api/books/${bookId}`)
        //console.log(response)
        expect(response).to.have.status(204)
    })
})