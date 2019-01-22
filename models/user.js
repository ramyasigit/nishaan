const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  devices: {
    type: Array(),
    default: []
  },
  password: {
    type: String,
    default: 'password'
  },
  typeOfUser:{
    type:String,
    default: "normal"
  }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUsers = function(callback) {
  User.find(callback);
}
module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}
module.exports.getUserByUserName = function(username, callback) {
  const query = {
    username: username
  };
  User.findOne(query, callback);
}
module.exports.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
}

module.exports.updateUserDevices = (user, options, callback) => {
  var query = {
    username: user.username
  };
  var update = {
    devices: user.devices
  }
  User.findOneAndUpdate(query, update, options, callback);
}

module.exports.updateUserType = (user, options, callback) => {
  var query = {
    username: user.username
  };
  var update = {
    typeOfUser: user.typeOfUser
  }
  User.findOneAndUpdate(query, update, options, callback);
}
module.exports.updatePassword = (user, options, callback) => {
  var query = {
    username: user.username
  };
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.newPassword, salt, (err, hash) => {
      if (err) throw err;
      var update = {
        password: hash
      }
      User.findOneAndUpdate(query, update, options, callback);
    });
  });
}

module.exports.deleteUser = (user, callback) => {
  const query = {
    username: user.username
  };
  User.findOne(query, (err, user) => {
    User.findByIdAndRemove(user._id, callback);
  });
}
