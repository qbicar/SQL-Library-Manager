const express = require('express');
const path = require('path');
const Book = require('./models').Book;
const app = express();
const port = 3000;
const sequelize = require('./models').sequelize;
const bodyParser = require('body-parser');

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, "views"))
app.use('/static', express.static('public'))
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

//works
app.get('/', (req, res) => {
  res.redirect('/books');
});

//works
app.get('/books', async (req, res) => {
  try {
    const books = await Book.findAll()
    res.render('index', { books: books })
  } catch (error) {
    res.render("page-not-found", { error })
  };
});

//works
app.get('/books/new', (req, res) => {
  res.render("new-book");
});

//Works
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

//works
app.get('/book/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  res.render('update-book', { book });
});

//Works
app.post('/book/:id', async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  await book.update(req.body)
  res.redirect('/books')
});

app.post('/books/:id/delete', async (req, res) => {
  const bookDestroy = await Book.findByPk(req.params.id);
  await bookDestroy.destroy();
  res.redirect('/books');
})

//works
app.use((req, res, next) => {
  const err = new Error("Oh No !An error has occured")
  err.status = 404 || 500
  next(err)
})
app.use((err, req, res, next) => {
  res.locals.error = err
  res.status(err.status)
  res.render('page-not-found')
});

//works
sequelize.sync().then(() => {
  app.listen(port);
  console.log("This application is listening on port " + port)
});