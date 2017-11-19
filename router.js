const Authentication = require('./controllers/authentication');
const Students = require('./controllers/students');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });
module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ message: 'Super secret code is ABC123' });
  });
  app.get('/school/:id/students', requireAuth, Students.getStudents);
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
  app.post('/students/signup', Authentication.signupStudent);
  app.post('/api/auth', Authentication.googleSignin);
}
