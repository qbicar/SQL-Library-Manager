const express = require('express');
const path = require('path');
const Book = require('./models').Book;
const app = express();
const port = 3000;
const sequelize = require('./models').sequelize;
const bodyParser = require('body-parser');

//<=======Setting view engine to reference view pugs===========>
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, "views"))
app.use('/static', express.static('public'))
app.use(bodyParser.json());

//<======support parsing of application to post data/ bodyparser is req to ref. req.body
app.use(bodyParser.urlencoded({ extended: true }));

//<======when routed to / (home) it will redirect to url "/books"===>
app.get('/', (req, res) => {
  res.redirect('/books');
});

//<======on route /books , books will findAll my books which is inside of models Book.js,
//and render my index pug with the parameter of books . If there is an error my page not
//found pug will be rendered===================================> 
app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll()
    res.render('index', { books: books })
  } catch (error) {
    res.render("page-not-found", { error })
  };
});

//<======on route /books/new , my new book pug will be render======>
app.get('/books/new', (req, res) => {
  res.render("new-book");
});

//<=====on route /books/new , my async function will try and await a book.create,
//when data is passed into form tit,aut,gen,yr. Data will be submitted to database as a new book
//on submit page will redirect to /books (home) once submitted=====>
app.post('/books/new', async (req, res) => {
  try {
    const { title, author, genre, year } = req.body
    await Book.create({
      title,
      author,
      genre,
      year
    }).then(() => {
      res.redirect("/books")
    })
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.render("error")
      console.error('Validation error:', errors)
    } else {
      throw error;
    };
  }
});

//<======on route /book/:id , set book as selected book id by using findByPk,
//once book id is selected my update-book will be rendered.======>
//findByPk is a way to find by ID
app.get('/books/:id', (req, res, next) => {
  Book.findByPk(req.params.id)
    .then(book => {
      if (book) {
        res.render('update-book', { book });
      } else {
        const err = new Error();
        err.status = 404
        next(err);
      }
    })
    .catch(err => {
      err.status = 500;
      next(err);
    })
});

//<=====on route /book/:id , it will find selected book and place the id in url,
//any information changed in book will update the req.body and will redirect to /books 
//on submit.=====================================================>
app.post('/books/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body)
  res.redirect('/books')
});

//<======on route book/:id/delete it will set my const to find selected book and place the id in url/delete,
//on delete it will destroy that const (id) and redirect to home (/books) on submit
app.post('/books/:id/delete', async (req, res) => {
  const bookDestroy = await Book.findByPk(req.params.id);
  await bookDestroy.destroy();
  res.redirect('/books');
})

//<=======middleware error handler for status 404 (not Found) || 500 (internal server error)
app.use((req, res, next) => {
  const err = new Error("Oh No !An error has occured");
  err.status = 404 || 500;
  next(err);
})
app.use((err, req, res, next) => {
  res.locals.error = err;
  res.status(err.status);
  res.render('page-not-found');
});

//sequelize.sync creates all of the tables in the specified database
sequelize.sync().then(() => {
  app.listen(port);
  console.log("This application is listening on port " + port);
});