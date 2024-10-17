const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
filtredUser=users.filter((user)=>user.username===username)
if(filtredUser.length>0){
  return true
}
return false
}
 
const authenticatedUser = (username,password)=>{ //returns boolean
  let validatedUser=users.filter((user)=>user.username===username && user.password===password)
  if(validatedUser.length>0){
    return true
  }else{
    return false
  }
 }

//only registered users can login
regd_users.post("/login", (req,res) => {
  
  let username = req.body.username
  let password = req.body.password
  if(username && password){
    if(isValid(username)){
      if(authenticatedUser(username,password)){
        let accessToken = jwt.sign({
          data: username
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
      }
       
    }else{
       
      return res.send('user not found!')
    }
  }
    return res.send('username or password not provided')
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let username = req.user.data

  let review = req.body.review
  let isbn = parseInt(req.params.isbn)
  let booksClone= books

  booksClone[isbn].reviews[username] = review;
  books = booksClone
  return res.send(books[isbn])
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.user.data
  let isbn = parseInt(req.params.isbn)
  delete books[isbn].reviews[username]
  return res.send(books[isbn])
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
