// src/routes/serviceCategoryRoutes.js
const express = require("express");
const {
  createServiceCategory,
  getServiceCategories,
  updateServiceCategory,
  deleteServiceCategory
} = require("../controller/serviceCategoryController"); // Import the new controller functions

const router = express.Router();

// Define routes for Service Categories
router.post("/", createServiceCategory);         // POST /api/servicecategories
router.get("/", getServiceCategories);          // GET /api/servicecategories
router.put("/:id", updateServiceCategory);      // PUT /api/servicecategories/:id
router.delete("/:id", deleteServiceCategory);   // DELETE /api/servicecategories/:id

module.exports = router;