const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

let books = [
    {
        bookName: "Rudest Book Ever",
        bookAuthor: "Shwetabh Gangwar",
        bookPages: 200,
        bookPrice: 240,
        bookState: "Available"
    },
    {
        bookName: "Do Epic Shit",
        bookAuthor: "Ankur Wariko",
        bookPages: 200,
        bookPrice: 240,
        bookState: "Available"
    }
];

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// Home Route - Display Books
app.get("/", (req, res) => {
    res.render("home", {data: books});
})

app.post("/", (req, res) => {
    const newBook = {
        bookName: req.body.bookName,
        bookAuthor: req.body.bookAuthor,
        bookPages: req.body.bookPages,
        bookPrice: req.body.bookPrice,
        bookState: "Available"
    };

    books.push(newBook);
    res.render("home", { data: books});
})

//Issue Book Route
app.post("/issue", (req, res) => {
    const requestedBookName = req.body.bookName;
    books.forEach(book => {
        if (book.bookName === requestedBookName) {
            book.bookState = "Issued";
        }
    });
    res.render("home", {data:books});
})

app.post("/return", (req, res) => {
    const requestedBookName = req.body.bookName;
    books.forEach(book => {
        if (book.bookName === requestedBookName) {
            book.bookState = "Available";
        }
    });
    res.render("home", {data:books});
})

app.post("/delete", (req, res) => {
    const requestedBookName = req.body.bookName;
    books = books.filter(book => book.bookName !== requestedBookName);
    res.render("home", {data:books});
})

app.listen(PORT, () => {
    console.log(`App is running on Port ${PORT}`);
})