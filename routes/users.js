const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');


//Update
router.post('/update', (req, res, next) => {
  const username = req.body.username;

  var packageArray = [req.body.username, req.body.from, req.body.to, req.body.tracking];


  User.getUserByUsername(username, (err, user) => {
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
      User.updateUser(packageArray, (err, user) => {
        if(err){
          res.json({success: false, msg:'Failed to update packages'});
        } else {
          res.json({success: true, msg:'update packages'});
        }
      });

  });
});


//Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    packages: req.body.packages
  });

  User.addUser(newUser, (err, user) => {
    if(err){
      res.json({success: false, msg:'Fail to register user'});
    } else {
      res.json({success: true, msg:'user registered'});
    }
  });

});

//authentic
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;

    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;

      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800
        });

        res.json({
          success: true,
          username: user.username,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }, 
          packages : user.packages
        });
      } else {
        return res.json({success: false, msg: 'Wrong Password'});
      }
    });
  });
});


router.get('/getUser/:username', (req, res, next) => {
  User.getUserByUsername(req.params.username, (err, user) => {
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    } else {
      return res.json(user);
    }
  });
});

//Do not use for security reasons
//This is purly Experimental for testing!!!
router.get('/getallusers', (req, res, next) => {
  User.getAllUsers(res, (err, users) => {
    if (!users) {
      return res.json({success: false, msg: 'User not found'});
    } else {
      return res.json(users);
    }
  });
});

//This is a frankenstien implementation bypassing the JWT autthentication
//This is only for mobile application purposes (Experimental), should not be used for actual deployment
//As users can bypass with this REST api route.
router.post('/getuserinfo', (req, res, next) => {
  const username = req.body.username;
  User.getUserByUsername(username, (err, user) => {
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    } else {
      return res.json(user.packages);
    }

  });
});


//profile
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: req.user});
});


module.exports = router;
