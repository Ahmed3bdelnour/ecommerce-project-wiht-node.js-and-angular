const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Product = require('../models/product');
const Review = require('../models/review');
const stripe = require('stripe')('sk_test_9nptLX5gVf3aPWrw4uvjo2JX00giaFFGGw');

const checkJWT = require('../middlewares/check-jwt');

router.route('/categories')
    .get((req, res, next) => {
        Category.find().then(categories => {
            res.json({
                success: true,
                message: 'categories fetched successfully',
                categories: categories
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err.message
            });
        });
    })
    .post((req, res, next) => {
        const { name } = req.body;
        const category = new Category({
            name: name
        });

        category.save().then(() => {
            res.json({
                success: true,
                message: 'category created successfully',
                category: category
            });
        }).catch(err => {
            res.json({
                success: false,
                message: err.message
            });
        });
    });

router.get('/categories/:id', async (req, res, next) => {
    try {
        const currentPage = req.query.page || 1;
        const perPage = 10;
        const category = await Category.find({ _id: req.params.id });
        const totalProducts = await Product.find({ category: req.params.id }).countDocuments();
        const products = await Product.find({ category: req.params.id })
            .skip((currentPage - 1) * perPage)
            .limit(perPage)
            .populate('category')
            .populate('owner')
            .populate('reviews')
            .exec();

        res.json({
            success: true,
            message: 'category',
            products: products,
            totalProducts: totalProducts,
            categoryName: category.name,
            pages: Math.ceil(totalProducts / perPage)
        });
    } catch (err) {
        res.json({
            success: false,
            message: 'failed to fetch products with specified category'
        });
    }

});

router.get('/product/:id', async (req, res, next) => {
    try {
        // const product = await Product.findOne({_id: req.params.id})
        // const product = await Product.findById({_id: req.params.id})
        const product = await Product.findById(req.params.id)
            .populate('owner')
            .populate('category')
            .populate({
                path: 'reviews',
                populate: { path: 'owner' }
            })
            .exec();
        res.json({
            success: true,
            message: 'product fetched successfully',
            product: product
        });
    } catch (err) {
        res.json({
            success: false,
            message: 'failed to fetch the product'
        });
    }
});


router.get('/products', async (req, res, next) => {
    try {
        const currentPage = req.query.page || 1;
        const perPage = 10;
        const totalProducts = await Product.find().countDocuments();
        const products = await Product.find()
            .skip((currentPage - 1) * perPage)
            .limit(perPage)
            .populate('category')
            .populate('owner')
            .populate('reviews')
            .exec();

        res.json({
            success: true,
            message: 'all products',
            products: products,
            totalProducts: totalProducts,
            pages: Math.ceil(totalProducts / perPage)
        });
    } catch (err) {
        res.json({
            success: false,
            message: 'failed to fetch products'
        });
    }

});

router.post('/review', checkJWT, async (req, res, next) => {
    try {
        const product = await Product.findOne({ _id: req.body.productId });

        if (!product) {
            res.json({
                success: false,
                message: 'product to be reviewed  not found '
            });
        }

        const review = new Review();

        review.owner = req.decoded.userId;

        if (req.body.title) review.title = req.body.title;
        if (req.body.description) review.description = req.body.description;
        review.rating = req.body.rating;

        product.reviews.push(review._id);
        product.save();
        review.save();

        res.send({
            success: true,
            message: 'review added successfully',
            review: review
        });

    } catch (err) {
        res.json({
            success: false,
            message: 'failed to add review'
        });
    }

});


router.post('/payment', checkJWT, (req, res, next) => {
    const stripeToken = req.body.stripeToken;
    const currentCharges = Math.round(req.body.totalPrice * 100);
  
    stripe.customers
      .create({
        source: stripeToken.id
      })
      .then(function(customer) {
        return stripe.charges.create({
          amount: currentCharges,
          currency: 'usd',
          customer: customer.id
        });
      })
      .then(function(charge) {
        const products = req.body.products;
  
        let order = new Order();
        order.owner = req.decoded.user._id;
        order.totalPrice = currentCharges;
        
        products.map(product => {
          order.products.push({
            product: product.product,
            quantity: product.quantity
          });
        });
  
        order.save();
        res.json({
          success: true,
          message: "Successfully made a payment"
        });
      });
  });
  


module.exports = router;