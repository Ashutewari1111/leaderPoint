const mongoose = require('mongoose');

// Define ClaimHistory schema
const ClaimHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pointsClaimed: {
    type: Number,
    required: true
  },
  claimedAt: {
    type: Date,
    default: Date.now
  }
});

// Export the model
module.exports = mongoose.model('ClaimHistory', ClaimHistorySchema);
