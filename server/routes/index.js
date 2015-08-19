var express = require('express');
var router = express.Router();
var path = require('path');
var mongoose =require('mongoose');
var passport = require('passport');


var mongoURI = "mongodb://localhost:27017/prime_example_passport";
var MongoDB = mongoose.connect(mongoURI).connection;

MongoDB.on('error', function (err) {
   console.log('mongodb connection error', err);
});

MongoDB.once('open', function () {
 console.log('mongodb connection open');
});


router.get("/", function(req,res,next){
   res.sendFile(path.resolve(__dirname, '../public/views/index.html'));
});

router.post('/',
   passport.authenticate('local', {
       successRedirect: '/users',
       failureRedirect: '/'
   })
);


module.exports = router;