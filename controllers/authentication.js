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
    school: req.user.school,
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

  if (role === 'student') {
    return res.status(422).send({ error: 'Only teachers may signup at this route'});
  }

  User.findOne({ username: username }, function(err, existingUser) {
    if (err) { return next(err); }
    if (existingUser) {
      return res.status(422).send({ error: 'username is in use' });
    }

    let school = req.body.school;
    let user;
    if (!school) {
      school = new School();
    }
    school.save(function(err) {
      if (err) { return next(err); }
      user = new User({
        username: username,
        password: password,
        role: role,
        email: email,
        school: school._id,
      });
      user.save(function(err) {
        if (err) { return next(err); }
        return res.json({ token: tokenForUser(user), user: user });
      });
    });
   });
}

exports.signupStudent = function(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;
  const role = req.body.role;
  const color = req.body.color;

  if (!username || !password) {
    return res.status(422).send({ error: 'You must provide an username and password' });
  }

  if (role === 'teacher') {
    return res.status(422).send({ error: 'Only students may signup at this route'});
  }

  User.findOne({ username: username }, function(err, existingUser) {
    if (err) { return next(err); }
    if (existingUser) {
      return res.status(422).send({ error: 'Username is in use' });
    }

    let school = req.body.school;
    let user;
      if (!school) {
        return res.status(422).send({ error: 'School not found' });
      }
      user = new User({
        username: username,
        password: password,
        role: role,
        school: school,
        color: color,
      });
      user.save(function(err) {
        if (err) { return next(err); }
        res.json({ token: tokenForUser(user), user: user });
      });
   });
}
