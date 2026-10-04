// src/controller/serviceCategoryController.js
const ServiceCategory = require("../schema/serviceCategorySchema");

// Create a new Service Category
exports.createServiceCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Service category name is required" });
    }

    const existingCategory = await ServiceCategory.findOne({ name: name });
    if (existingCategory) {
      return res.status(409).json({ message: "Service category with this name already exists" });
    }

    const serviceCategory = new ServiceCategory({ name });
    await serviceCategory.save();
    res.status(201).json({ message: "Service category created successfully", serviceCategory });
  } catch (err) {
    console.error("Error creating service category:", err);
    res.status(500).json({ message: "Failed to create service category", error: err.message });
  }
};

// Get all Service Categories
exports.getServiceCategories = async (req, res) => {
  try {
    const serviceCategories = await ServiceCategory.find().sort({ name: 1 });
    res.status(200).json(serviceCategories);
  } catch (err) {
    console.error("Error fetching service categories:", err);
    res.status(500).json({ message: "Failed to fetch service categories", error: err.message });
  }
};

// Update a Service Category
exports.updateServiceCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Service category name is required for update" });
    }

    const updatedServiceCategory = await ServiceCategory.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true } // Return the updated document, run schema validators
    );

    if (!updatedServiceCategory) {
      return res.status(404).json({ message: "Service category not found" });
    }
    res.status(200).json({ message: "Service category updated successfully", serviceCategory: updatedServiceCategory });
  } catch (err) {
    console.error("Error updating service category:", err);
    // Handle unique name constraint error specifically
    if (err.code === 11000) { // Duplicate key error code
        return res.status(409).json({ message: "Service category with this name already exists" });
    }
    res.status(500).json({ message: "Failed to update service category", error: err.message });
  }
};

// Delete a Service Category
exports.deleteServiceCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedServiceCategory = await ServiceCategory.findByIdAndDelete(id);

    if (!deletedServiceCategory) {
      return res.status(404).json({ message: "Service category not found" });
    }
    res.status(200).json({ message: "Service category deleted successfully" });
  } catch (err) {
    console.error("Error deleting service category:", err);
    res.status(500).json({ message: "Failed to delete service category", error: err.message });
  }
};