const PropertiesService = require('./properties.service');
const Joi = require('joi');

// HTTP Handlers for properties
const PropertiesController = {
  // Register a unit
  async registerUnit(req, res, next) {
    const schema = Joi.object({
      county: Joi.string().required(),
      place: Joi.string().required(),
      unitName: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      const result = await PropertiesService.registerUnit(req.landlord.id, req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  // Update a unit
  async updateUnit(req, res, next) {
    const schemaParams = Joi.object({
      unitId: Joi.string().uuid().required()
    });

    const { error: paramError } = schemaParams.validate(req.params);
    if (paramError) return res.status(400).json({ message: 'Invalid unit ID format' });

    const { unitId } = req.params;
    const schemaBody = Joi.object({
      county: Joi.string().required(),
      place: Joi.string().required(),
      unitName: Joi.string().required()
    });

    const { error: bodyError } = schemaBody.validate(req.body);
    if (bodyError) return res.status(400).json({ message: bodyError.details[0].message });

    try {
      const result = await PropertiesService.updateUnit(req.landlord.id, unitId, req.body);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  // Delete a unit
  async deleteUnit(req, res, next) {
    const schemaParams = Joi.object({
      unitId: Joi.string().uuid().required()
    });

    const { error: paramError } = schemaParams.validate(req.params);
    if (paramError) return res.status(400).json({ message: 'Invalid unit ID format' });

    const { unitId } = req.params;
    try {
      await PropertiesService.deleteUnit(req.landlord.id, unitId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  // Get landlord's units
  async getMyUnits(req, res, next) {
    try {
      const result = await PropertiesService.getMyUnits(req.landlord.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  // Post a room
  async postRoom(req, res, next) {
    const schemaParams = Joi.object({
      unitId: Joi.string().uuid().required()
    });
    
    const { error: paramError } = schemaParams.validate(req.params);
    if (paramError) return res.status(400).json({ message: 'Invalid unit ID format' });

    const { unitId } = req.params;
    const schemaBody = Joi.object({
      roomType: Joi.string().required(),
      roomsAvailable: Joi.number().integer().min(0).required(),
      price: Joi.number().min(0).required(),
      description: Joi.string().allow('').optional()
    });

    const { error: bodyError } = schemaBody.validate(req.body);
    if (bodyError) return res.status(400).json({ message: bodyError.details[0].message });

    try {
      const result = await PropertiesService.postRoom(req.landlord.id, unitId, req.body, req.file);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  // Update listing
  async updateListing(req, res, next) {
    const schemaParams = Joi.object({
      roomId: Joi.string().uuid().required()
    });

    const { error: paramError } = schemaParams.validate(req.params);
    if (paramError) return res.status(400).json({ message: 'Invalid room ID format' });

    const { roomId } = req.params;
    const schemaBody = Joi.object({
      roomType: Joi.string().required(),
      roomsAvailable: Joi.number().integer().min(0).required(),
      price: Joi.number().min(0).required(),
      description: Joi.string().allow('').optional()
    });

    const { error: bodyError } = schemaBody.validate(req.body);
    if (bodyError) return res.status(400).json({ message: bodyError.details[0].message });

    try {
      const result = await PropertiesService.updateListing(req.landlord.id, roomId, req.body, req.file);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  // Delete listing
  async deleteListing(req, res, next) {
    const schemaParams = Joi.object({
      roomId: Joi.string().uuid().required()
    });

    const { error: paramError } = schemaParams.validate(req.params);
    if (paramError) return res.status(400).json({ message: 'Invalid room ID format' });

    const { roomId } = req.params;
    try {
      await PropertiesService.deleteListing(req.landlord.id, roomId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  // Get landlord listings
  async getMyListings(req, res, next) {
    try {
      const result = await PropertiesService.getMyListings(req.landlord.id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  // Get all listings (Public)
  async getAllListings(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const result = await PropertiesService.getAllListings(page, limit);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = PropertiesController;
