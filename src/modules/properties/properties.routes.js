const express = require('express');
const PropertiesController = require('./properties.controller');
const auth = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const router = express.Router();

// Public routes
router.get('/all', PropertiesController.getAllListings);

// Protected routes (Landlord only)
router.post('/unit', auth, PropertiesController.registerUnit);
router.put('/unit/:unitId', auth, PropertiesController.updateUnit);
router.delete('/unit/:unitId', auth, PropertiesController.deleteUnit);
router.get('/my-units', auth, PropertiesController.getMyUnits);
router.post('/room/:unitId', auth, upload.single('image'), PropertiesController.postRoom);
router.put('/room/:roomId', auth, upload.single('image'), PropertiesController.updateListing);
router.delete('/room/:roomId', auth, PropertiesController.deleteListing);
router.get('/my-listings', auth, PropertiesController.getMyListings);

module.exports = router;
