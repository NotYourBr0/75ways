const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',                     
  },
  tags: [                                 
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag',
    required: true,
  }
],
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["✅Published", "❌Unpublished"],
    default: "✅Published"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Blog", blogSchema);