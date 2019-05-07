const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const checkJwt = require('../middlewares/check-jwt');

router.post('/signup', (req, res, next) => {

    const { name, email, password, isSeller } = req.body;

    User.findOne({ email: email }).then((existingUser) => {
        if (existingUser) {
            res.json({
                success: false,
                message: "an account with this email already exists"
            });
        } else {
            const user = new User();
            user.name = name;
            user.email = email;
            user.password = password;
            user.picture = user.gravatar();
            user.isSeller = isSeller;

            const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '7d' });

            user.save().then(() => {
                res.json({
                    success: true,
                    message: 'registration is completed successfully',
                    token: token
                });
            }).catch(err => {
                throw new Error(err.message);
            });
        }
    });
});


router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email: email }).then(async (user) => {
        if (!user) {
            res.json({
                success: false,
                message: "Authentication failed, wrong email",
            });
        } else {
            const isValidPasswrd = await user.comparePassword(password);
            if (!isValidPasswrd) {
                res.json({
                    success: false,
                    message: 'Authentication faild, wrong password'
                });
            } else {

                const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '7d' });

                res.json({
                    success: true,
                    message: 'Authenticated login',
                    token: token
                });
            }
        }
    }).catch(err => {
        throw err;
    });
});


router.route('/profile')
.get(checkJwt, (req, res, next)=>{
    User.findOne({_id: req.decoded.userId}).then( user => {
        if(!user){
            res.json({
                success: false,
                message: 'user not found'
            });
        }else{
            res.json({
                success: true,
                message: 'user fetched successfully',
                user: user
            });
        }
    }).catch(err =>{
        throw new Error(err.message);
    });
})
.post(checkJwt, (req, res, next)=>{
    User.findOne({_id: req.decoded.userId}, (err, user)=>{
        if (err) throw err;
        if(!user) {
            return res.json({
                success: false,
                message: 'user not found'
            });
        }

        if(req.body.name) user.name = req.body.name;
        if(req.body.email) user.email = req.body.email;
        if(req.body.password) user.password = req.body.password;

        user.isSeller = req.body.isSeller;

        user.save().then(data => {
            res.json({
                success: true,
                message: 'user updated successfully',
                user: user
            });
        }).catch(err => {
            throw err;
        });

    });
});


router.route('/address')
.get(checkJwt, (req, res, next)=>{
    User.findOne({_id: req.decoded.userId}).then( user => {
        if(!user){
            res.json({
                success: false,
                message: 'address not found'
            });
        }else{
            res.json({
                success: true,
                message: 'address fetched successfully',
                address: user.address
            });
        }
    }).catch(err =>{
        throw new Error(err.message);
    });
})
.post(checkJwt, (req, res, next)=>{
    User.findOne({_id: req.decoded.userId}, (err, user)=>{
        if (err) throw err;
        if(!user) {
            return res.json({
                success: false,
                message: 'address not found'
            });
        }

        if(req.body.address1) user.address.address1 = req.body.address1;
        if(req.body.address2) user.address.address2 = req.body.address2;
        if(req.body.city) user.address.city = req.body.city;
        if(req.body.state) user.address.state = req.body.state;
        if(req.body.country) user.address.country = req.body.country;
        if(req.body.postalCode) user.address.postalCode = req.body.postalCode;

        user.save().then(() => {
            res.json({
                success: true,
                message: 'address updated successfully',
                address: user.address
            });
        }).catch(err => {
            throw err;
        });

    });
});




module.exports = router;