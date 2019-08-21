const express = require('express');
const Sequelize = require('sequelize');
const path = require('path');

const app = express();
const port = 3000;

const UserRouter = express.Router();
//dialect specifies the specific version of sql im using
//storage key to specify the path for sqlite and create a database called library
const sequelize = new Sequelize ({
    dialect: 'sqlite',
    storage: 'library.db',
    logging: false, //disables log in terminal
});

//Defing Library model
//initialize the model
class Library extends Sequelize.Model {}
//defines a new table in the database with the name Library. Seq looks for information in that table
//string identifies that the variable will be set to up to  255 characters and interger is a number variable
Library.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type:Sequelize.STRING,
        allowNull: false, //disallow Null
        validate: {
            notNull: {
                msg: 'Please provide a value for "Title"',
            },
            notEmpty: {
                msg: 'Please provide a value for "Title"',
            }
         },
    },
    author: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
            notNull:{
                msg: 'Please provide a value for "Author"', 
            },
            notEmpty: {
                msg: 'Please provide a value for "Author"',
            }
         },
    },
    genre: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {sequelize});
    
//IIFE(Immediately Invoked Function Expression) is a JavaScript function that runs as soon as it is define
//authenticate returns a promise that resolves to a successful connection to database
//force sync library table and logging the data returned by library.toJson();
(async () => {
    await sequelize.sync({force:true});
    try{
        const books = await Library.create({
            title: 'Chicka Chicka Boom Boom',
            author: ' Bill Martin, Jr',
            genre:'Children',
            year:1989
        });
        console.log(books.toJSON());
        // await books.save();
        const books2 = await Library.create({
            title: 'Red Fish Blue Fish',
            author: ' Dr.Seuss',
            genre: 'Children',
            year: 1960
        });
        console.log(books2.toJSON());
        //converts to json
        
    }catch(error){
        if(error.name === 'SequelizeValidationError'){
            const errors = error.errors.map(err => err.message);
            console.error('Validation errors:', errors)
        }else{
            throw error;
        }
    }
})();

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, "views"))
app.use("/static", express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.render('index')
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