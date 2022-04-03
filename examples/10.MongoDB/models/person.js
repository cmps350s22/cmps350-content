import mongoose from 'mongoose';

// define a schema
const personSchema = new mongoose.Schema({
    name: {
        first: String,
        last: String
    }
});

//define a fullName property that won't get persisted to MongoDB.
personSchema.virtual('fullName').get(function () {
    return this.name.first + ' ' + this.name.last;
});

// define a model
const Person = mongoose.model('Person', personSchema);

// create a document
const student1 = new Person({
    name: { first: 'Ali', last: 'Faleh' }
});

console.log(student1.fullName); // Ali Faleh

/*
If you use toJSON() or toObject() mongoose will not include virtuals by default.
Pass { virtuals: true } to either toObject() or toJSON().
 */

console.log(student1.toJSON());
console.log(student1.toJSON({ virtuals: true }));