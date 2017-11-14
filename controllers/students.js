const User = require('../models/user');

const groupById = (arr) => ({
    byId: arr.reduce((acc, item) => {
      acc[item._id] = item;
      console.log(acc);
      return acc;
    }, {}),
    all: arr.map(item => item._id),
})

exports.getStudents = function(req, res, next) {
  const schoolId = req.params.id;
  if (!schoolId) {
    return res.status(422).send({ error: 'You must provide a school id' });
  }

  User.find({ school: schoolId, role: 'student' }, function(err, users) {
    if (err) { return next(err); }
    if (!users || users.length === 0) {
      return res.status(404).send({ error: 'No students found' });
    }
    const byId = groupById(users);
    return res.status(200).json({ users: byId })
   });
}
