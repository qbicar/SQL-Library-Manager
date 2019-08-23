const express = require('express');
// const Sequelize = require('sequelize');
const path = require('path');
const Books = require('./models').Books;
const app = express();
const port = 3000;
// const library = require('./library.db');

//dialect specifies the specific version of sql im using
//storage key to specify the path for sqlite and create a database called library
const sequelize = require('./models').sequelize;

sequelize.sync()
    .then(() => {
        Books.findAll()
            .then((books) => {
                console.log(books)
            })
    }
    )
    .then(() => {
        Books.create({
            title: 'where the wild things are',
            author: 'Maurice Sendak',
            genre: 'Children',
            year: 1963
        })
    }
    )
    .catch((error) => {
        console.log(error)
    })


// Dummy.drop().then(() => {
//     console.log('table deleted');
// }).finally(() => {
//     sequelize.close();
// });

//Defing Library model
//initialize the model

//IIFE(Immediately Invoked Function Expression) is a JavaScript function that runs as soon as it is define
//authenticate returns a promise that resolves to a successful connection to database
//force sync library table and logging the data returned by library.toJson();
// (async () => {
//     await sequelize.sync({ force: true });
//     try {
//         const books1 = await Books.create({
//             title: 'Chicka Chicka Boom Boom',
//             author: ' Bill Martin, Jr',
//             genre: 'Children',
//             year: 1989
//         });
//         console.log(books1.toJSON());
//         // await books.save();
//         const books2 = await Books.create({
//             title: 'Red Fish Blue Fish',
//             author: ' Dr.Seuss',
//             genre: 'Children',
//             year: 1960
//         });
//         console.log(books2.toJSON());
//         //converts to json
//         const books3 = await Books.build({
//             title: 'where the wild things are',
//             author: 'Maurice Sendak',
//             genre: 'Children',
//             year: 1963
//         });
//         await books3.save();
//         console.log(books3.toJSON());
//         // findByPk() (or 'find by primary key') retrieves a single instance by its primary key 
//         const bookById = await Books.findAll({
//             attributes: ['id', 'title'],
//         });
//         console.log(bookById.toJSON());
//     } catch (error) {
//         if (error.name === 'SequelizeValidationError') {
//             const errors = error.errors.map(err => err.message);
//             console.error('Validation errors:', errors)
//         } else {
//             throw error;
//         }
//     }
// })();

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, "views"))
app.use("/static", express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.render('index', { Books })
    //res.render('index', { books})
});

// app.get('/books', (req, res) => {
//    // res.render('index', { books })
// });

app.get('/books/new', (req, res) => {
    res.render('new-book')
});

// UserRouter.route('/books/new').post(function (req, res) {
//     const book = new Book()
// }) 

// app.get('/books/:id', (req, res) => {
//     //res.render('index', { books })
// });

// UserRouter.route('/books/:id').post(function (req, res) {
//     //update book
// }) 

// UserRouter.route('/books/:id/delete').post(function (req, res) {
//     //delete the book
// }) 


// app.use((req, res, next) => {
//     const err = new Error("Oh No !An error has occured")
//     err.status = 404
//     next(err)
// })
// app.use((err, req, res, next) => {
//     res.locals.error = err
//     res.status(err.status)
//     res.render('error')
// })




app.listen(port);
console.log("This application is listening on port " + port)