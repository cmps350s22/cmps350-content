const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

//see more assertion examples @ http://chaijs.com/api/bdd/

describe('Countries Web API Test Suite', () => {
    it('Asia should should have 50 countries', async () => {
        const region = 'Asia';
        const uri = `region/${region}`;

        const response = await chai.request('https://restcountries.eu/rest/v1/').get(uri);
        //console.log(response);
        expect(response).to.have.status(200);
        expect(response).to.be.json;
        expect(response).to.have.property('body').and.be.a('array');
        expect(response.body).to.have.property('length', 50);
    });
});