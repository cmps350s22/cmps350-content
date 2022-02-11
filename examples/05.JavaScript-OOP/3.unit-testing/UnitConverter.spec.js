import unitConverter from "./UnitConverter.js";
import {expect} from 'chai';

describe("Calculator Test Suite", () => {
    it("should convert kg to pound", () => {
        expect( unitConverter.kgToPound(2) ).to.equal(4.4092);
    })
});