const express = require('express');
const router = express.Router();
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gifs']



router.get('/', async (req, res) => {
    let query = Book.find()
    if(req.query.title !== '' && req.query.title !== null){
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if(req.query.publishedBefore !== '' && req.query.publishedBefore !== null){
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if(req.query.publishedAfter !== '' && req.query.publishedAfter !== null){
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch(e){
        res.redirect('/')
    }
})
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

router.post('/', async (req, res) => {

    let book  = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover)
    try {
        book = await book.save();
        res.redirect(`books`)
    } catch(e){
        console.log(e)
        renderNewPage(res, book, true)
    }
})
async function renderNewPage(res, book, hasError = false){
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if(hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new', params)
    }
    catch(e){
        console.log(e)
        res.redirect('/books')
    }
}
function saveCover(book, coverEncoded){
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, 'base64')
        book.coverImageType = cover.type
    }

}
module.exports = router;