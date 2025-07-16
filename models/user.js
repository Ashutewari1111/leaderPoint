const mongoose = require('mongoose');

// Define User schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  totalPoints: {
    type: Number,
    default: 0
  }
});

// Export model
module.exports = mongoose.model('User', UserSchema);
