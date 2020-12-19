//jshint esversion:6
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load
  
}

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

console.log(stripeSecretKey)


const fs = require('fs')
const stripe = require('stripe')(stripeSecretKey)




const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _= require("lodash");

const multer = require('multer');
const path = require('path');





const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const User = require('./models/user');
const mongoose =require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');



app.use(session({
  secret: 'notagoodsecret',
  resave: true,
  saveUninitialized: true
}));






const upload = multer({
  dest: 'uploads/' // this saves your file into a directory called "uploads"
}); 



app.get('/image', (req, res) => {
  res.sendFile(__dirname );
});

// It's very crucial that the file name matches the name attribute in your html
app.post('/portaits', upload.single('image'), (req, res) => {
  res.redirect('/');
});







mongoose.connect('mongodb://localhost:27017/OSSF', {useNewUrlParser:true,  useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


    




app.get("/", function (req, res) {
  res.render("home");
  
});


app.get("/blog", function (req,res){
  res.render("blog");
    
});

app.get("/shop", function (req,res){
  res.render("shop");
});

app.get("/portraits", function(req,res){
  res.render("portraits");
})




app.get('/signup', (req,res)=>{
  res.render('signup')
})


app.post('/signup', async (req, res) => {
  const {password, username} = req.body;
  const hash = await bcrypt.hash (password,12);
  const user = new User ({
      username,
      password: hash
  })
  await user.save();
  req.session.user_id = user._id;
  res.redirect('/')
})







app.get("/signin",(req, res)=> {
  res.render('signin')
})



app.post('/signin', async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({username});
 const validPassword = await bcrypt.compare(password, user.password)
 if(validPassword) {
     req.session.user_id = user._id;
     res.redirect('/')
 }
 else {
     res.redirect('/signin')
 }

})



app.get("/logout", function (req,res) {
  res.render("logout");
});

app.post('/logout', (req, res) => {
  req.session.user_id=null;
  
  res.redirect('/signin');
  })



app.get("/post_04", function (req,res){
  res.render("post_04");
});















app.get('/store', function(req, res) {
  fs.readFile('items.json', function(error, data) {
    if (error) {
      res.status(500).end()
    } else {
      res.render('store.ejs', {
        stripePublicKey: stripePublicKey,
        items: JSON.parse(data)
      })
    }
  })
})




app.post('/purchase', function(req, res) {
  fs.readFile('items.json', function(error, data) {
    if (error) {
      res.status(500).end()
    } else {
      const itemsJson = JSON.parse(data)
      const itemsArray = itemsJson.music.concat(itemsJson.merch)
      let total = 0
      req.body.items.forEach(function(item) {
        const itemJson = itemsArray.find(function(i) {
          return i.id == item.id
        })
        total = total + itemJson.price * item.quantity
      })

      stripe.charges.create({
        amount: total,
        source: req.body.stripeTokenId,
        currency: 'usd'
      }).then(function() {
        console.log('Charge Successful')
        res.json({ message: 'Successfully purchased items' })
      }).catch(function() {
        console.log('Charge Fail')
        res.status(500).end()
      })
    }
  })
})






app.listen(3000, function() {
  console.log("Server started on port 3000");
});