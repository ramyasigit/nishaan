const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

//Get all
router.get('/all', (req, res) => {
  User.getUsers((err, users) => {
    if (err) {
      console.error(err);
      res.json({
        success: false,
        msg: 'Failed to find users'
      });
    } else {
      res.json({
        success: true,
        msg: 'Users Updated',
        users: users
      });

    }
  });
});

//Get a user with username
router.post('/userIn', (req, res, next) => {
  const username = req.body.username;
  User.getUserByUserName(username, (err, user) => {
    if (err) console.error(err);
    if (!user) {
      return res.json({
        success: false,
        msg: 'User not found'
      });
    } else {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          devices: user.devices,
          typeOfUser: user.typeOfUser
        }
      });
    }
  });
});
// Register
router.post('/register', (req, res, next) => {
  let newUser = new User({
    name: req.body.name,
    username: req.body.username,
    devices: req.body.devices,
    password: req.body.password,
    typeOfUser: req.body.typeOfUser
  });
  User.getUserByUserName(newUser.username, (err, user) => {
    if (err) {
      res.json({
        success: false,
        msg: 'Failed to register user'
      });
    }

    if (user) {
      return res.json({
        success: false,
        msg: 'User name allready exists'
      });
    } else {
      User.addUser(newUser, (err, user) => {
        if (err) {
          res.json({
            success: false,
            msg: 'Failed to register user'
          });
        } else {
          res.json({
            success: true,
            msg: 'User registered'
          });
        }
      });
    }
  });
});
// Authenticate
router.post('/authenticate', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  User.getUserByUserName(username, (err, user) => {
    if (err) console.error(err);
    if (!user) {
      return res.json({
        success: false,
        msg: 'User not found'
      });
    }
    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) console.error(err);
      if (isMatch) {
        const token = jwt.sign(user, config.secret, {
          expiresIn: 240000 // 1 week
        });
        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            devices: user.devices,
            typeOfUser: user.typeOfUser
          }
        });
      } else {
        return res.json({
          success: false,
          msg: 'Wrong password'
        });
      }
    });
  });
});

router.post('/updatePassword', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const newPassword = req.body.newPassword;

  var updateuser = {
    username: username,
    newPassword: newPassword
  };
  User.getUserByUserName(username, (err, user) => {
    if (err) console.error(err);
    if (!user) {
      return res.json({
        success: false,
        msg: 'User not found'
      });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) console.error(err);
      if (isMatch) {
        User.updatePassword(updateuser, {}, (err) => {
          if (err) {
            console.error(err);
            res.json({
              success: false,
              msg: 'Failed to Update'
            });
          } else res.json({
            success: true,
            msg: 'Password Updated'
          });
        });
      } else {
        return res.json({
          success: false,
          msg: 'Wrong password'
        });
      }
    });
  });
});

router.put('/update', (req, res) => {
  var user = {
    username: req.body.username,
    devices: req.body.devices
  }
  User.updateUserDevices(user, {}, (err) => {
    if (err) {
      console.error(err);
      res.json({
        success: false,
        msg: 'Failed to Update'
      });
    } else res.json({
      success: true,
      msg: 'Updated'
    });
  });
});

router.put('/updateType', (req, res) => {
  var user = {
    username: req.body.username,
    typeOfUser: req.body.typeOfUser
  }
  User.updateUserType(user, {}, (err, user) => {
    if (err) {
      console.error(err);
      res.json({
        success: false,
        msg: 'Failed to Update'
      });
    } else res.json({
      success: true,
      msg: 'Updated'
    });
  });
});

router.post('/delete', (req, res) => {
  User.deleteUser(req.body, (err, user) => {
    if (err) {
      console.error(err);
      res.json({
        success: false,
        msg: 'Failed to Delete'
      });
    } else res.json({
      success: true,
      msg: 'Deleted'
    });
  });
});

module.exports = router;
