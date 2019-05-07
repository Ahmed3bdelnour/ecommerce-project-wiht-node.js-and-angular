const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    owner: {type: Schema.Types.ObjectId , ref: 'User'},
    title: String,
    description: String,
    rating: {type: Number, default: 0},
    created: {type: Date, default: Date.now}
});


const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;