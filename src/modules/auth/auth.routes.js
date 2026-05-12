const express = require('express');
const AuthController = require('./auth.controller');
const router = express.Router();

// Auth routes
router.post('/signup', AuthController.signup);
router.post('/signin', AuthController.signin);
router.post('/refresh', AuthController.refresh);

module.exports = router;
