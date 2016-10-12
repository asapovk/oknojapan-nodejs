var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err,user);
  });
});

//Here we describe strategy for signup

passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},function (req, email, password, done){
  //req.checkBody('username','Username is required').notEmpty();
  //req.checkBody('firstName','First name is required').notEmpty();
  //req.checkBody('city','City is required').notEmpty();
  req.checkBody('email','Invalid email').notEmpty().isEmail();
  req.checkBody('password','Password length is too short').notEmpty().isLength({min: 6});
  req.checkBody('passwordRetype','Retype the password correctly').optional().matches(req.body.password);
  var errors = req.validationErrors();
  if (errors){
    var messages =[];
    errors.forEach(function (error) {
        messages.push(error.msg);
    });
    return done(null, false, req.flash('error',messages));
  }
  User.findOne({'email' : email}, function (err, user){
    if(err){
      return done(err);
    }
    if (user) {
      return done(null,false, {message: 'Email is already in use.'});
    }
    var newUser = new User();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.username = req.body.username;
    newUser.firstName = req.body.firstName;
    newUser.lastName = req.body.lastName;
    newUser.city = req.body.city;
    newUser.country = req.body.country;
    newUser.avatar = req.body.avatar;
    newUser.bio = req.body.bio;
    newUser.save(function(err,result){
      if(err){
        return done(err);
      }
      return done(null, newUser);
    });

  });
}));



passport.use('local.signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},function (req, email, password, done){
  req.checkBody('email','Invalid email').notEmpty().isEmail();
  req.checkBody('password','Wrong password').notEmpty();
  var errors = req.validationErrors();
  if (errors){
    var messages =[];
    errors.forEach(function (error) {
        messages.push(error.msg);
    });
    return done(null, false, req.flash('error',messages));
  }
  User.findOne({'email' : email}, function (err, user){
    if(err){
      return done(err);
    }
    if (!user) {
      return done(null,false, {message: 'Wrong username or password'});
    }
    if(!user.validPassword(password)) {
      return done(null,false, {message: 'Wrong username or password'});
    }

    return done(null,user);

  });
}));
