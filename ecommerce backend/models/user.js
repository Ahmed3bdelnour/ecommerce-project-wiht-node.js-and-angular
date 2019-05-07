const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
const crypto = require('crypto');

const saltRounds = 10;

const UserSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true
    },
    name: String,
    password: String,
    picture: String,
    isSeller: {
        type: Boolean,
        default: false
    },

    address: {
        address1: String,
        address2: String,
        city: String,
        state: String,
        country: String,
        postalCode: String
    },

    created: {
        type: Date,
        default: Date.now
    }
}, {
        toJSON: {
            hide: 'password __v',
            transform: true
        }
    });

UserSchema.options.toJSON.transform = (doc, ret, options) => {

    if (options.hide) {
        options.hide.split(' ').forEach(function (prop) {
            delete ret[prop];
        });
    }
    return ret;

}

UserSchema.pre('save', function (next) {
    console.log('before saving')
    const user = this;
    if (user.isNew || user.modifiedPaths().includes('password')) {
        // user.password = await bcrypt.hash(user.password, saltRounds);

        bcrypt.hash(user.password, saltRounds).then((hash) => {
            user.password = hash;
            next();
        });
    }else{
        next();
    }

});

UserSchema.method('comparePassword', function (password) {
    const user = this;
    return bcrypt.compare(password, user.password);
});

UserSchema.methods.gravatar = (size) => {
    if (!this.size) size = 200;
    if (!this.email) {
        return 'https://gravatar.com/avatar/?s=' + size + '&d=retro';
    } else {
        const hashedEmail = crypto.createHash('md5').update(this.email).digest('hex');
        return 'https://gravatar.com/avatar/' + hashedEmail + '?s=' + size + '&d=retro';
    }
}



const User = mongoose.model('User', UserSchema);
module.exports = User;