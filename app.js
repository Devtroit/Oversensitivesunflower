require('dotenv').config()

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY




const formidable = require("formidable");


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
const { ppid } = require('process')
const { default: Stripe } = require('stripe')
const { result } = require('lodash')



app.use(session({
  secret: 'notagoodsecret',
  resave: true,
  saveUninitialized: true
}));


const upload = multer({
  dest: 'uploads/' // this saves your file into a directory called "uploads"
}); 



app.get('/upload', (req, res) => {
  res.sendFile(__dirname );
});

// It's very crucial that the file name matches the name attribute in your html
app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.body.name);
  console.log(req.body.email);
  console.log(req.body.notes);
  res.redirect('/success');
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

app.get("/upload", function(req,res){
  res.render("upload");
})

app.get("/success", function(req,res){
  res.render("success");
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
  res.redirect('/active-home')
})



app.get('/active-home', (req,res) => {
  res.render('active-home')

})



app.get("/signin",(req, res)=> {
  res.render('signin')
})


app.get('/user-auth-fail', (req,res) => {
  res.render('user-auth-fail')

})


app.post('/signin', async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({username});
 const validPassword = await bcrypt.compare(password, user.password)
 if(validPassword) {
     req.session.user_id = user._id;
     res.redirect('active-home')
 }
 else {
     res.render('user-auth-fail')
 }

})

app.get("/active-blog", function (req,res){
  res.render("active-blog");
});

app.get("/active-shop", function (req,res){
  res.render("active-shop");
});


app.get("/active-store", function (req,res){
  res.render("active-store");
});





app.get("/active-upload", function (req,res){
  res.render("active-upload");
});







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

app.get("/active-post_04", function (req,res){
  res.render("active-post_04");
})











app.get("/store", function (req,res){
  res.render("store");
})







app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    
    submit_type: 'pay',
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
    payment_method_types: ['card'],


line_items: [ {

        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Doll',
            images: ['https://scontent.fdet1-1.fna.fbcdn.net/v/t1.0-9/130299546_208468710856002_8876663472685907129_o.png?_nc_cat=107&ccb=2&_nc_sid=8024bb&_nc_ohc=-02lhxWgYAQAX84q-C2&_nc_ht=scontent.fdet1-1.fna&oh=6b3ac8040ed72c3f873daedbcb2ea36d&oe=601400A2'],
          },
          unit_amount: 199,
        },
        quantity: 1,

      },
    ]
 ,


   
    
    
   







    mode: 'payment',
    success_url: 'http://www.google.com',
    cancel_url: 'http://www.google.com',
  });
  res.json({ id: session.id });
});















app.listen(4000, function() {
  console.log("Server started on port 4000");
});