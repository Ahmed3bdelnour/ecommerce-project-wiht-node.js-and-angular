const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();
const userRoutes = require('./routes/account');
const mainRoutes = require('./routes/main');
const sellerRoutes = require('./routes/seller');
const productSearchRoutes = require('./routes/product-search');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'images');
    },
    filename: (req, file, cb)=>{
        cb(null, Math.random().toString() + '_' + file.originalname);
    }
});

const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(morgan('dev'));



//routes
app.use('/api', mainRoutes);
app.use('/api/accounts', userRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/search', productSearchRoutes);





mongoose.connect("mongodb://127.0.0.1:27017/ecommerce", { useNewUrlParser: true , useCreateIndex : true, useFindAndModify : false}).then((err) => {
    console.log('connected to data base');
    app.listen(3000, () => {
        console.log('server is listenning on http://localhost:3000');
    })
}).catch(() => {
    console.log("connection to data base failed");
    process.exit(1);
});


