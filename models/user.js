const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User schema
const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    require: true
  },
  username:{
    type:String,
    required: true
  },
  password:{
    type:String,
    required: true
  },
  packages: [{
    from: String,
    to: String,
    tracking: String

  }]
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.updateUser = function(packages, callback){

  //console.log(packages[1]);

  User.findOneAndUpdate(
    {'username':packages[0]},
    {$push:
      {"packages" :
    {
      'from' : packages[1],
      'to' : packages[2],
      'tracking' : packages[3]
    }}},
    {upsert:true}, callback);
}

module.exports.getAllUsers = function(res, callback){
  User.find((err, users) => {
    if(err) {
      res.send(err);
    } else {
      res.json(users);
    }
  })
}

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username}
  User.findOne(query, callback);
}

// module.exports.getUserInfo = function(username, callback){
//
// }

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;

      newUser.password = hash;
      newUser.save(callback);

    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}
