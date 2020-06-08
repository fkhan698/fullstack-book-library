const express = require('express');
const router = express.Router();
const Author = require('../models/author')

router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.name !== '' && req.query.name !== null){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const authors = await Author.find(searchOptions)
        res.render("authors/index", {
            authors: authors,
            searchOptions: req.query
        });
    } catch(e){
        res.redirect('/')
    }
    
})
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

router.post('/', async (req, res) => {
    let author = new Author({
        name: req.body.name
    })
    try{
    author = await author.save();
    res.redirect('authors')
    } catch(e){
        res.render('authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

module.exports = router;