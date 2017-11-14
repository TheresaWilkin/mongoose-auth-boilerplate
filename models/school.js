const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const schoolSchema = new Schema({
  created : {
      type : Date,
      default : Date.now
    }
});

// Create the model class
const ModelClass = mongoose.model('school', schoolSchema);

// Export the model
module.exports = ModelClass;
