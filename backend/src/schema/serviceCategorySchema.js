// src/schema/serviceCategorySchema.js
const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true // Add trim to remove whitespace
  },
  serviceCount: { // Similar to postCount in your Category schema
    type: Number, 
    default: 0 
  }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

module.exports = mongoose.model("ServiceCategory", serviceCategorySchema);