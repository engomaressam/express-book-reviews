const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user. Please provide both username and password."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let getBooksPromise = new Promise((resolve,reject) => {
    resolve(books);
  });

  getBooksPromise.then((bookList) => {
    res.send(JSON.stringify(bookList, null, 4));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let getBookDetailsPromise = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });

  getBookDetailsPromise.then(
    (bookDetails) => res.send(bookDetails),
    (error) => res.status(404).json({message: error})
  );
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let getBooksByAuthorPromise = new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    let filtered_books = [];
    for (const key of bookKeys) {
      if (books[key].author === author) {
        filtered_books.push(books[key]);
      }
    }
    resolve(filtered_books);
  });

  getBooksByAuthorPromise.then((filteredBooks) => {
    res.send(filteredBooks);
  });
});

// Get all books based on title using a Promise
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let getBooksByTitlePromise = new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    let filtered_books = [];
    for (const key of bookKeys) {
      if (books[key].title === title) {
        filtered_books.push(books[key]);
      }
    }
    resolve(filtered_books);
  });

  getBooksByTitlePromise.then((filteredBooks) => {
    res.send(filteredBooks);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
