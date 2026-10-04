// src/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controller/dashboardController');

// Define the routes for fetching the counts
router.get('/users/count', dashboardController.getUsersCount);
router.get('/blogs/count', dashboardController.getBlogsCount);
router.get('/interviews/count', dashboardController.getInterviewsCount);
router.get('/services/count', dashboardController.getServicesCount);

module.exports = router;