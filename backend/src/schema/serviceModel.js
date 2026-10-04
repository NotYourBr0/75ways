// src/schema/serviceModel.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  serviceName: { // Renamed from service1 and service2
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String, // path to image file
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);