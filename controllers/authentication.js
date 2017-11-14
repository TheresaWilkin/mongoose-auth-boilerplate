const jwt = require('jwt-simple');
const User = require('../models/user');
require('dotenv').config();

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.secret);
}

exports.signin = function(req, res, next) {
  // user is already authenticated
  // just need to give token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(422).send({ error: 'You must provide an username and password' });
  }

  User.findOne({ username: username }, function(err, existingUser) {
    if (err) { return next(err); }
    if (existingUser) {
      return res.status(422).send({ error: 'username is in use' });
    }

    const user = new User({
      username: username,
      password: password
    });

    user.save(function(err) {
      if (err) { return next(err); }

      res.json({ token: tokenForUser(user) });
    });
   });
}
