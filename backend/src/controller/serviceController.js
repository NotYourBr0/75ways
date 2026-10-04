// src/controller/serviceController.js
const Service = require('../schema/serviceModel');
const path = require('path');

exports.addService = async (req, res) => {
  try {
    const { category, serviceName, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const newService = new Service({ category, serviceName, description, image });
    await newService.save();

    res.status(201).json({ message: "Service added successfully", service: newService });
  } catch (error) {
    console.error("Failed to add service:", error);
    res.status(500).json({ message: "Failed to add service", error: error.message || "Server Error" });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    console.error("Failed to fetch services:", error);
    res.status(500).json({ message: "Failed to fetch services", error: error.message || "Server Error" });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json(service);
  } catch (error) {
    console.error("Failed to fetch service:", error);
    res.status(500).json({ message: "Failed to fetch service", error: error.message || "Server Error" });
  }
};

exports.editService = async (req, res) => {
  try {
    const { category, serviceName, description } = req.body;
    const updateData = { category, serviceName, description };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Service not found" });

    res.status(200).json({ message: "Service updated", service: updated });
  } catch (error) {
    console.error("Failed to update service:", error);
    res.status(500).json({ message: "Failed to update service", error: error.message || "Server Error" });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Service not found" });

    res.status(200).json({ message: "Service deleted" });
  } catch (error) {
    console.error("Failed to delete service:", error);
    res.status(500).json({ message: "Failed to delete service", error: error.message || "Server Error" });
  }
};

// New function to handle the paginated services logic
exports.getPaginatedServices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || "";

    const query = {
      $or: [
        { serviceName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ]
    };

    const total = await Service.countDocuments(query);
    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      services,
    });
  } catch (error) {
    console.error("Failed to fetch paginated services:", error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

// src/controller/serviceController.js

// ... (existing controller functions like addService, getAllServices, etc.) ...

// New function to get the total count of services
exports.getServicesCount = async (req, res) => {
    try {
        const count = await Service.countDocuments();
        res.json({ count });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};