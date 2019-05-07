const express = require('express');
const router = express.Router();
const checkJWT = require('../middlewares/check-jwt');
const Product = require('../models/product');

const faker = require('faker');

router.route('/products')
.get(checkJWT, (req, res, next)=>{
    Product.find({owner: req.decoded.userId})
    .populate('owner')
    .populate('category')
    .exec()
    .then(products => {
        console.log(products);
        res.json({
            success: true,
            message: 'products fetched successfully',
            products: products
        });
    })
    .catch(err => {
        res.json({
            success: false,
            message: err.message
        });
    });
})
.post(checkJWT, (req, res, next)=>{
    //from multer middleware
    if(!req.file){
        return res.json({
            success: false,
            message: 'file type is not allowed'
        });
    }
    const product = new Product();
    product.owner = req.decoded.userId;
    product.category = req.body.categoryId;
    product.image = req.file.path;
    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;

    product.save().then(()=>{
        res.json({
            success: true,
            message: 'product created successfully',
            product: product
        });
    }).catch(err => {
        res.json({
            success: false,
            message: 'failed to create new product: ' + err.message
        });
    });
});

// adding fake products in db

router.post('/faker/test',(req, res, next)=>{
    for(var i = 0; i<20; i++){
        const product = new Product();
        product.owner = "5cc85429968e901beca0bdbd";
        product.category = "5cca36a403e0421fdc8f7179";
        product.image = faker.image.food();
        product.title = faker.commerce.productName();
        product.description = faker.lorem.words();
        product.price = faker.commerce.price();

        product.save();
    }

    res.json({
        message: 'created 20 product successfully'
    });
});

module.exports = router;