const express = require('express');
const router = express.Router();
const algoliaSearch = require('algoliasearch');
const client = algoliaSearch('L9KQU3BW3C', '867bac7ebe693e101e1c7ee0cb605406');

const index = client.initIndex('amazonov1');

router.get('/', (req, res, next)=>{

    if(req.query.query){
        index.search({
            query: req.query.query,
            page: req.query.page
        }, (err, content)=>{
            res.json({
                success: true,
                message: 'here is your search',
                status: 200,
                content: content,
                search_result: req.query.query
            });
        });
    }

});

module.exports = router;