const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name:{
        type: String,
        unique: true,
        lowercase: true
    },
    created: {type: Date, default: Date.now}
}, {
    toJSON: {
        hide: '__v',
        transform: true
    }
});

categorySchema.options.toJSON.transform = (doc, ret, options) => {

    if (options.hide) {
        options.hide.split(' ').forEach(function (prop) {
            delete ret[prop];
        });
    }
    return ret;

}

module.exports = mongoose.model('Category' , categorySchema);