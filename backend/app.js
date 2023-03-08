const express = require('express')
const bodyParser = require('body-parser')
const app = express();
const mongoose = require('mongoose')
const postRoutes = require('./Routes/posts')
// app.use((req,res,next)=>{
//   console.log("I am console One");
//   next();
// })

mongoose.connect('mongodb+srv://crud:DsAIUahDoaD6m6cB@crud.fg66fgt.mongodb.net/All_in_One?retryWrites=true&w=majority').then(() => {
  console.log("Connected To Database")
}).catch(() => {
  console.log("Connected Failed!");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept")
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE,OPTIONS");
  next();
})

app.use('/api/posts',postRoutes);

module.exports = app;
