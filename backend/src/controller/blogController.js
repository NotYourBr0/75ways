const Blog = require("../schema/blogSchema");
const Category = require("../schema/categorySchema");
const Tag = require("../schema/tagsSchema");

// Helper to convert tag names to ObjectIds
const getTagIdsFromNames = async (tagNames) => {
    if (!tagNames) return [];
    if (typeof tagNames === 'string') {
        tagNames = tagNames.split(',').map(t => t.trim()).filter(Boolean);
    }
    if (!Array.isArray(tagNames) || tagNames.length === 0) return [];

    const tagDocs = await Tag.find({ name: { $in: tagNames } });
    return tagDocs.map(tag => tag._id);
};

// Helper to update postCount for tags and category
const adjustPostCounts = async (oldCategory, newCategory, oldTagIds = [], newTagIds = []) => {
    // Category logic
    if (oldCategory !== newCategory) {
        if (oldCategory) {
            await Category.findByIdAndUpdate(oldCategory, { $inc: { postCount: -1 } });
        }
        if (newCategory) {
            await Category.findByIdAndUpdate(newCategory, { $inc: { postCount: 1 } });
        }
    }

    // Tag logic
    const oldTagStrings = oldTagIds.map(id => id.toString());
    const newTagStrings = newTagIds.map(id => id.toString());

    const tagsToDecrease = oldTagStrings.filter((tagId) => !newTagStrings.includes(tagId));
    const tagsToIncrease = newTagStrings.filter((tagId) => !oldTagStrings.includes(tagId));

    // Update post counts for Tag model
    if (tagsToDecrease.length > 0) {
        await Tag.updateMany({ _id: { $in: tagsToDecrease } }, { $inc: { postCount: -1 } });
    }
    if (tagsToIncrease.length > 0) {
        await Tag.updateMany({ _id: { $in: tagsToIncrease } }, { $inc: { postCount: 1 } });
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

// Create Blog
exports.createBlog = async (req, res) => {
    try {
        // 'image' is now directly from req.body, containing the Firebase URL
        const { text, description, category, tags, status, image } = req.body; 

        // Validation adjusted: 'image' is now expected as a string (URL)
        if (!text || !description || !category || !status || !image) {
            return res.status(400).json({ message: "Missing required fields (text, description, category, status, image URL)" });
        }

        const tagIds = await getTagIdsFromNames(tags);

        const blog = new Blog({
            text,
            description,
            category,
            tags: tagIds,
            status,
            image, // 'image' directly stores the Firebase URL
        });

        await blog.save();

        await adjustPostCounts(null, category, [], tagIds);
        res.status(201).json({ message: "Blog created successfully", blog });

    } catch (error) {
        console.error("Create blog error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message, details: error.errors });
        }
        res.status(500).json({ error: "Failed to create blog" });
    }
};

// Get All Blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("category", "name")
            .populate("tags", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(blogs);
    } catch (error) {
        console.error("Get blogs error:", error);
        res.status(500).json({ error: "Failed to fetch blogs" });
    }
};

// Get Single Blog by ID 
exports.getBlogById = async (req, res) => { // <--- ADD THIS NEW FUNCTION
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("category", "name") // Populate category name
            .populate("tags", "name");   // Populate tag names

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        console.error("Error fetching single blog:", error);
        // Handle invalid MongoDB ID format specifically
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid blog ID format' });
        }
        res.status(500).json({ error: "Failed to fetch blog" });
    }
};
// Delete Blog by ID
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const oldTagsForAdjustment = Array.isArray(blog.tags)
            ? blog.tags.map(id => id.toString())
            : [];

        await adjustPostCounts(
            blog.category ? blog.category.toString() : null,
            null, // No new category for delete
            oldTagsForAdjustment,
            [] // No new tags for delete
        );

        const deleteResult = await Blog.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        console.error("Delete blog error:", error);
        res.status(500).json({ error: "Delete failed" });
    }
};

// Update Blog
exports.updateBlog = async (req, res) => {
    try {
        // 'image' is now directly from req.body, containing the Firebase URL
        const { text, description, category, tags, status, image } = req.body; 

        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const newTagIds = await getTagIdsFromNames(tags);

        const oldTagIdsFromBlog = Array.isArray(blog.tags) ? blog.tags.map(id => id.toString()) : [];

        await adjustPostCounts(
            blog.category ? blog.category.toString() : null,
            category,
            oldTagIdsFromBlog,
            newTagIds
        );

        blog.text = text;
        blog.description = description;
        blog.category = category;
        blog.tags = newTagIds;
        blog.status = status;
        // Update image only if a new image URL is provided (i.e., user uploaded a new image)
        // If image is an empty string or null from frontend, it means no new image was uploaded
        if (image) blog.image = image; 

        const updatedBlog = await blog.save();

        res.status(200).json({ message: "Blog updated successfully", blog: updatedBlog });

    } catch (error) {
        console.error("Update blog error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message, details: error.errors });
        }
        res.status(500).json({ error: "Failed to update blog" });
    }
};