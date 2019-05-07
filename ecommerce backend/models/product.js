const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mongooseAlgolia = require('mongoose-algolia');


const ProductSchema = new Schema({
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
    image: String,
    title: String,
    description: String,
    price: Number,
    created: { type: Date, default: Date.now }
}, {
        toJSON: {
            hide: '__v',
            transform: true,
            virtuals: true
        }
    });

ProductSchema.options.toJSON.transform = (doc, ret, options) => {

    if (options.hide) {
        options.hide.split(' ').forEach(function (prop) {
            delete ret[prop];
        });
    }
    return ret;

}

ProductSchema.virtual('averageRating').get(function () {
    var rating = 0;
    if (this.reviews.length == 0) {
        rating = 0;
    } else {
        this.reviews.map(review => {
            rating += review.rating;
        });

        rating = rating / this.reviews.length;
    }

    return rating;
});

ProductSchema.plugin(mongooseAlgolia, {
    appId: 'L9KQU3BW3C',
    apiKey: '867bac7ebe693e101e1c7ee0cb605406',
    indexName: 'amazonov1',
    selector: '_id title image reviews description price owner created averageRating',
    populate: {
        path: 'owner reviews',
        select: 'name rating'
    },
    defaults: {
        author: 'uknown'
    },
    mappings: {
        title: function (value) {
            return `${value}`
        }
    },
    virtuals: {
        averageRating: function (doc) {
            var rating = 0;
            if (doc.reviews.length == 0) {
                rating = 0;
            } else {
                doc.reviews.map((review) => {
                    rating += review.rating;
                });
                rating = rating / doc.reviews.length;
            }

            return rating;
        }
    },
    debug: true
});

const Product = mongoose.model('Product', ProductSchema);
Product.SyncToAlgolia();
Product.SetAlgoliaSettings({
    searchableAttributes: ['title', 'description', 'price', 'averageRating']
});

module.exports = Product;