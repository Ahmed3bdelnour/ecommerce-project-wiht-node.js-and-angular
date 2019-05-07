const jwt = require('jsonwebtoken');

module.exports = (req, res , next)=>{
    const {authorization: token } = req.headers;

    if(token){
        jwt.verify(token, 'secretkey', function (err, decoded){
            if(err){
                return res.json({
                    success: false,
                    message: 'failed to authenticate token'
                });
            }

            req.decoded = decoded;
            next();
        });
    }else{
        res.status(403).json({
            success: false,
            message: 'request failed, no token detected'
        });
    }
}