// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const Review = require('../schema/Review'); // Adjust path as needed

// POST a new review
router.post('/', async (req, res) => {
  try {
    const { user, userName, rating, feedback } = req.body;

    // Basic validation to ensure required fields are present
    if (!user || !userName || !rating) {
      return res.status(400).json({ error: 'User, userName, and rating are required fields.' });
    }

    const newReview = new Review({
      user,
      userName,
      rating,
      feedback,
      // You can add other fields here if needed, e.g., serviceId
    });

    await newReview.save();

    // Send a 201 Created status with the new review object
    res.status(201).json({ message: 'Review submitted successfully!', review: newReview });

  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Failed to submit review. Please try again.' });
  }
});

// GET all reviews (for admin panel)
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// GET the count of unread reviews (for the bell icon badge)
router.get('/unread-count', async (req, res) => {
  try {
    const count = await Review.countDocuments({ isRead: false });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching unread review count:', error);
    res.status(500).json({ error: 'Failed to fetch unread review count' });
  }
});

// UPDATE a review to mark it as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndUpdate(id, { isRead: true }, { new: true });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json({ message: 'Review marked as read', review });
  } catch (error) {
    console.error('Error marking review as read:', error);
    res.status(500).json({ error: 'Failed to mark review as read' });
  }
});

module.exports = router;