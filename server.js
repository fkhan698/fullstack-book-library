if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path: '.env'});
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');

//Routers
const authorRouter = require('./routes/author');
const indexRouter = require('./routes/index')
const bookRouter = require('./routes/books')

//Database connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})
const db = mongoose.connection;
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'));

//View engine
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use('/public', express.static(path.join(__dirname, "public")));
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))
app.use(express.static('public'))


app.use('/', indexRouter);
app.use('/authors', authorRouter)
app.use('/books', bookRouter)

app.listen( process.env.PORT || 3000)