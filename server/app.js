var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var index = require('./routes/index');
var passport = require('passport');
var session = require('express-session');
var User = require('./models/user');
var register = require('./routes/register');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: true
    }
));

app.use(session({
    secret: 'secret',
    key: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60000, secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());


var localStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {
   User.findById(id, function(err,user){
       if(err) done(err);
       done(null,user);
   });
});

passport.use('local', new localStrategy({
       passReqToCallback : true,
       usernameField: 'username'
   },
function(req, username, password, done){
   User.findOne({ username: username }, function(err, user) {
       if (err) throw err;
       if (!user)
           return done(null, false, {message: 'Incorrect username and password.'});

       // test a matching password
       user.comparePassword(password, function(err, isMatch) {
           if (err) throw err;
           if(isMatch)
               return done(null, user);
           else
               done(null, false, { message: 'Incorrect username and password.' });
       });
   });
}));

app.use('/register', register);
app.use("/", index);

var server = app.listen(3000,function(){
    var port = server.address().port;
    console.log("Listening on port: ", port);
});

module.exports = app;

