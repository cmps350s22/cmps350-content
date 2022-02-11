import calculator from './calculator.js';
import {expect} from 'chai';

describe("Calculator Test Suite", () => {

    before(function() {
        // runs before all tests in this Test Suite
    })

    after(function() {
        // runs after all tests in this Test Suite
    })

    beforeEach(function() {
        // runs before each test in this Test Suite
    })

    afterEach(function() {
        // runs after each test in this Test Suite
    })

    it("should add two numbers", () => {
        expect( calculator.add(3, 2) ).to.equal(5);
        expect( calculator.add(-1, -2) ).to.equal(-3);
    })

    it("should subtract two numbers", () => {
        expect( calculator.subtract(3, 2) ).to.equal(1);
        expect( calculator.subtract(-10, -1) ).to.equal(-9);
    })

    it("should multiply correctly", () => {
        expect( calculator.multiply(2, 3) ).to.equal(6);
    })

    it("should divide correctly", () => {
        expect( calculator.divide(10, 5) ).to.equal(2);
    })

    it("should return NaN when multiplying a string with a number", function() {
        expect( calculator.multiply('a', 3) ).to.be.NaN;
    });

    it("should return throw an exception when dividing by 0", function() {
        //For testing for exceptions you have to pass a function to expect. Note the result of calling the function
        expect( () => calculator.divide(10, 0) ).to.throw("Invalid input");
    });

    //More info @ https://chaijs.com/api/bdd/
    it("Other expect matchers", () => {
        expect({ foo: 'baz' }).to.have.property('foo').and.equal('baz')
        expect(1 === 1).to.be.true
        expect('b' + 'a' + 'r' ).to.equal('bar')

        expect(() => x.y.z).to.throw();
        expect(() => x.y.z).to.throw(ReferenceError);
        expect(() => x.y.z).to.throw(ReferenceError, /is not defined/);
        expect(() => x.y.z).to.throw(/is not defined/);
        expect(() => 42).not.to.throw();
        expect(() => x.y.z).to.throw(Error);

        expect( { foo: 'bar' }).to.have.property('foo').and.not.equal('baz')

        expect([1, 2, 3]).to.include.members([3, 2]);
        expect([1, 2, 3]).to.not.include.members([3, 2, 8]);

        // deep referencing
        let deepObj = {
            green: { tea: 'matcha' },
            teas: [ 'chai', 'matcha', { tea: 'konacha' } ]
        };

       expect(deepObj).to.have.nested.property('green.tea', 'matcha');
       expect(deepObj).to.have.nested.property('teas[1]', 'matcha');
       expect(deepObj).to.have.nested.property('teas[2].tea', 'konacha');
    })
})