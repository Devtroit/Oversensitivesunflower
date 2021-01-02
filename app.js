if (process.env.NODE_ENV !== 'production') require('dotenv').config()



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
const User = require('./models/user');
const mongoose =require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { ppid } = require('process')
const { default: Stripe } = require('stripe')
const { result } = require('lodash')

mongoose.connect('mongodb://localhost:27017/OSSF', {useNewUrlParser:true,  useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
  secret: 'notagoodsecret',
  resave: true,
  saveUninitialized: true
}));


app.get("/", function (req, res) {
  res.render("home");
  
});


app.get("/blog", function (req,res){
  res.render("blog");
    
});

app.get("/post_01", function (req,res){
  res.render("post_01");
});



app.get("/shop", function (req,res){
  res.render("shop");
});

app.get("/upload", function(req,res){
  res.render("upload");
})

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


app.get("/success", function(req,res){
  res.render("success");
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
     res.redirect('active-home')
 }
 else {
     res.send('err')
 }

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




app.get("/active-blog", function (req,res){
  res.render("active-blog");
});

app.get("/active-post_01", function (req,res){
  res.render("active-post_01");
})

app.get("/active-shop", function (req,res){
  res.render("active-shop");
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
          unit_amount: 1199,
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





app.post('/create-checkout-session1', async (req, res) => {
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
            name: 'Power',
            images: ['https://scontent.fdet1-1.fna.fbcdn.net/v/t1.0-9/118594860_167641001605440_4528174919482982099_o.jpg?_nc_cat=101&ccb=2&_nc_sid=2d5d41&_nc_ohc=dVGj_lS4ESEAX-0R009&_nc_ht=scontent.fdet1-1.fna&oh=14eec20cb4f1e1e73763e05d616267e4&oe=60148831'],
          },
          unit_amount: 999,
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



app.post('/create-checkout-session2', async (req, res) => {
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
            name: 'Jess',
            images: ['https://scontent.fdet1-1.fna.fbcdn.net/v/t1.0-9/110791671_151990013170539_5836220212289867910_n.jpg?_nc_cat=106&ccb=2&_nc_sid=2d5d41&_nc_ohc=jmcBbDfNYi8AX9B2fQc&_nc_ht=scontent.fdet1-1.fna&oh=6ecec13fab43995899380c2ae48d95be&oe=6017E915'],
          },
          unit_amount: 799,
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


app.post('/create-checkout-session3', async (req, res) => {
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
            name: 'Miracle',
            images: ['https://scontent.fdet1-1.fna.fbcdn.net/v/t1.0-9/96095056_109048277464713_3981654899250167808_o.jpg?_nc_cat=107&ccb=2&_nc_sid=2d5d41&_nc_ohc=shTGn4twQx4AX9vF8hG&_nc_ht=scontent.fdet1-1.fna&oh=b0d87a425acd8ca01030af9a15db8b18&oe=6014C3AB'],
          },
          unit_amount: 999,
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


app.post('/create-checkout-session4', async (req, res) => {
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
            name: 'Moody',
            images: ['https://scontent.fdet1-2.fna.fbcdn.net/v/t1.0-9/109444356_155704692799071_2496486456411889218_o.jpg?_nc_cat=111&ccb=2&_nc_sid=2d5d41&_nc_ohc=FgzfMmsIQU0AX8Beire&_nc_ht=scontent.fdet1-2.fna&oh=d77568421f0e890dd177555794e6f537&oe=60158DFB'],
          },
          unit_amount: 999,
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








app.post('/create-checkout-session5', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    
    submit_type: 'donate',
    billing_address_collection: 'auto',
    shipping_address_collection: {
      allowed_countries: ['US', 'CA'],
    },
    payment_method_types: ['card'],


line_items: [ {

        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Outside Agitators',
            images: ['https://scontent.fdet1-1.fna.fbcdn.net/v/t1.0-9/82110231_130481328654741_5433284580360585216_n.jpg?_nc_cat=101&ccb=2&_nc_sid=9e2e56&_nc_ohc=ku2zRsRYFh0AX-l97FI&_nc_ht=scontent.fdet1-1.fna&oh=7aeafa87760d6a32fdafd0317694ef5b&oe=6015C5B9'],
          },
          unit_amount: 999,
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






let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);