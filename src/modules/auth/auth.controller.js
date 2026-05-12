const AuthService = require('./auth.service');
const Joi = require('joi');

// Handles HTTP requests for auth
const AuthController = {
  // Signup handler
  async signup(req, res, next) {
    const schema = Joi.object({
      fullName: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      const result = await AuthService.signup(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  // Signin handler
  async signin(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
      const { email, password } = req.body;
      const result = await AuthService.signin(email, password);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  // Refresh Token handler
  async refresh(req, res, next) {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: 'Refresh token is required' });

    try {
      const result = await AuthService.refreshToken(token);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AuthController;
