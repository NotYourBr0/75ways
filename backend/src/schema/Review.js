// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to a User model if you have one
    required: false, // Make this optional if a user is not logged in
  },
  userName: {
    type: String,
    default: 'Anonymous',
  },
  rating: {
    type: String,
    enum: ['Bad', 'Neutral', 'Good', 'Excellent'],
    required: true,
  },
  feedback: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;