if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path: '.env'});
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

//Routers
const authorRouter = require('./routes/author');
const indexRouter = require('./routes/index')

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
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))


app.use('/', indexRouter);
app.use('/authors', authorRouter)

app.listen(3000)