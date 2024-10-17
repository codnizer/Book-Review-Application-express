const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username
  let password = req.body.password
  if(username && password){
  if(doesExist(username)){
    return res.send('user already exist!')
  }else{
    users.push({username,password})
    return res.send('user registred successfully!')
  }
}
  return res.send('username or password not provided')
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books,null,4))
});

public_users.get('/listbooks',function (req, res) {

  axios.get('http://localhost:5000/')
    .then(response => {
      // Send response
      return res.status(200).json(response.data);
    })
    .catch(error => {
      // Handle error
      return res.status(500).json({ message: 'An error occurred', error: error.message });
    });

  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  let targetbook = books[isbn]
  if(targetbook){
    return res.status(200).send(JSON.stringify(targetbook,null,4))
  }
  return res.status(404).json({message: "isbn is invalid"});
 });

 public_users.get('/listbooks/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn)
  axios.get('http://localhost:5000/')
    .then(response => {
      // Send response
      return res.status(200).json(response.data[isbn]);
    })
    .catch(error => {
      // Handle error
      return res.status(500).json({ message: 'An error occurred', error: error.message });
    });

});


  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author.toString()
  const keys = Object.keys(books);
  let result = [];
  for(i=0;i<keys.length;i++){
    if(books[keys[i]].author === author){
      result.push(books[keys[i]]);
    }
  }
  if (result.length > 0) {
    return res.status(200).json(result); // Return all matching books
  }

  return res.status(404).json({ message: "Author not found" });
 });


 public_users.get('/listbooksbyath/:author', function (req, res) {
  let mybooks=[]
  let author = req.params.author.toString();
  console.log(mybooks)
  axios.get('http://localhost:5000/')
    .then(response => {
      mybooks = response.data;
      console.log(mybooks)
    })
    .catch(error => {
      // Handle error
      return res.status(500).json({ message: 'An error occurred', error: error.message });
    });
    console.log(books)
      const keys = Object.keys(books);
      let result = [];

      // Loop through the books and filter by author
      for (let i = 0; i < keys.length; i++) {
        if (books[keys[i]].author === author) {
          result.push(books[keys[i]]);
        }
      }
      // Check if any books were found
      if (result.length > 0) {
        return res.status(200).json(result);  // Return matching books
      } else {
        return res.status(404).json({ message: `No books found by author: ${author}` });
      }
});



// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title.toString()
  const keys = Object.keys(books);
  let result = [];
  for(i=0;i<keys.length;i++){
    if(books[keys[i]].title === title){
      result.push(books[keys[i]]);
    }
  }
  if (result.length > 0) {
    return res.status(200).json(result); // Return all matching books
  }

  return res.status(404).json({ message: "title not found" });
 });


 public_users.get('/listbooksbytitle/:title', function (req, res) {
  let mybooks=[]
  let title = req.params.title.toString();
  axios.get('http://localhost:5000/')
    .then(response => {
      mybooks = response.data;
    })
    .catch(error => {
      // Handle error
      return res.status(500).json({ message: 'An error occurred', error: error.message });
    });
      const keys = Object.keys(books);
      let result = [];

      // Loop through the books and filter by author
      for (let i = 0; i < keys.length; i++) {
        if (books[keys[i]].title === title) {
          result.push(books[keys[i]]);
        }
      }
      // Check if any books were found
      if (result.length > 0) {
        return res.status(200).json(result);  // Return matching books
      } else {
        return res.status(404).json({ message: `No books found by title: ${title}` });
      }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn

  let targetbook = books[isbn]
  if(targetbook){
    return res.status(200).send(JSON.stringify(targetbook.reviews,null,4))
  }
  return res.status(404).json({message: "isbn is invalid"});
});

module.exports.general = public_users;
