import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
    name: {type: String, required: true},
    city: {type: String, required: true},
});

const Store = mongoose.model('Store', storeSchema);
export default Store;