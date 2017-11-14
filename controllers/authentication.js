const jwt = require('jwt-simple');
const User = require('../models/user');
const School = require('../models/school');
require('dotenv').config();

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.secret);
}

exports.signin = function(req, res, next) {
  // user is already authenticated
  // just need to give token
  const user = {
    username: req.user.username,
    role: req.user.role,
    email: req.user.email,
    id: req.user._id,
  }
  res.send({ token: tokenForUser(req.user), user: user });
}

exports.signup = function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  const email = req.body.email;

  if (!username || !password) {
    return res.status(422).send({ error: 'You must provide an username and password' });
  }

  User.findOne({ username: username }, function(err, existingUser) {
    if (err) { return next(err); }
    if (existingUser) {
      return res.status(422).send({ error: 'username is in use' });
    }

    let school = req.body.school;
    let user;
    if (role === 'teacher') {
      if (!school) {
        school = new School()._id;
      }
      user = new User({
        username: username,
        password: password,
        role: role,
        email: email,
        school: school,
      });
    } else {
      user = new User({
        username: username,
        password: password,
        role: role,
        school: school,
      });
    }

    const newUser = {
      username: user.username,
      role: user.role,
      email: user.email,
      id: user._id,
    };

    user.save(function(err) {
      if (err) { return next(err); }

      res.json({ token: tokenForUser(user), user: newUser });
    });
   });
}
