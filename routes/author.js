const express = require('express')
const router = express.Router();
const Author = require('../models/author')
const Book = require('../models/book')

router.get('/', async(req, res) => {
    let searchOptions = {};
    if(req.query.name !== '' && req.query.name !== null){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render('authors/index', {
            searchOptions: req.query,
            authors: authors
        })
    } catch(e){
        res.redirect('/')
    }
})

router.get('/new', (req, res) => {
    res.render('authors/new', {author: new Author() })
}) 

router.post('/', async (req, res) => {
    let author = new Author({
        name: req.body.name
    })
    try{
        author = await author.save();

        res.redirect(`authors/${author.id }`)
    }catch(e){
        res.redirect('/authors/new', {
            author: author,
            errorMessage: 'Error Creating Author'
        })
    }
})

router.get('/:id', async (req, res) => {
    try{
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id}).limit(6).exec()
        res.render('authors/show', {
            booksByAuthor: books,
            author: author
        })
    }
    catch(e){
        res.redirect('/authors')
    }
})
router.get('/:id/edit', async (req, res) => {
   try{
    const author = await Author.findById(req.params.id );
    res.render('authors/edit', {author: author})
   }catch(e){
       console.log(e)
       res.redirect('/authors')
   }
})
router.put('/:id', async (req, res) => {
    let author
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/authors/${ author.id }`)
    }catch(e){
        
        if(author == null ){
            res.redirect('/')
        }else {
            console.log(e)
            res.render('authors/edit', {
                author: author,
                errorMessage: 'Error updating author'
            })
        }
        
    }
})
router.delete('/:id', async (req, res) => {
    let author 
    try {
        author = await Author.findById(req.params.id)
        author = await author.remove()
        res.redirect('/authors')
    } catch(e){
        if(author === null){
            res.redirect('/')
        } else {
            console.log(e)
            res.redirect(`/authors/${author.id}`)
        }
    }
})
module.exports = router;