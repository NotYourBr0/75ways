// src/controllers/dashboardController.js
const User = require('../schema/userSchema'); // Assuming your user model path
const Blog = require('../schema/blogSchema'); // Assuming your blog model path
const Interview = require('../schema/interview'); // Assuming your interview model path
const Service = require('../schema/serviceModel'); // Assuming your service model path

// Function to get the total count of users
exports.getUsersCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Function to get the total count of blog posts
exports.getBlogsCount = async (req, res) => {
    try {
        const count = await Blog.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Function to get the total count of interviews
exports.getInterviewsCount = async (req, res) => {
    try {
        const count = await Interview.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Function to get the total count of services
exports.getServicesCount = async (req, res) => {
    try {
        const count = await Service.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};