const express = require("express");
const router = express.Router();
const {
    createBlog,
    getAllBlogs,
    deleteBlog,
    updateBlog,
    getBlogById,
    getBlogsCount
} = require("../controller/blogController");

// General route to get all blogs (should come first)
router.get("/", getAllBlogs);

// Define the SPECIFIC 'count' route next
router.get("/count", getBlogsCount);

// Define the general ':id' route AFTER the specific ones
router.get("/:id", getBlogById);

// Other routes with dynamic IDs should also be placed here
router.delete("/delete/:id", deleteBlog);
router.put('/update/:id', updateBlog);
router.post("/create", createBlog);

module.exports = router;