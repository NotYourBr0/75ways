const express = require('express');
const router = express.Router();
const {
  addService,
  getAllServices,
  getServiceById,
  editService,
  deleteService,
  getPaginatedServices, // <-- Now importing the new function
   getServicesCount
} = require('../controller/serviceController');

const upload = require('../controller/uploadServices');

// Service routes
router.post('/addService', upload.single('image'), addService);
router.get('/services', getAllServices);

// DEFINE THE SPECIFIC 'count' ROUTE FIRST
router.get('/services/count', getServicesCount);

// The paginated route is defined here, calling the new controller function
router.get('/services/paginated', getPaginatedServices);

// The more general :id route is defined AFTER the specific paginated route
router.get('/services/:id', getServiceById);

router.put('/services/:id', upload.single('image'), editService);
router.delete('/services/:id', deleteService);

module.exports = router;
