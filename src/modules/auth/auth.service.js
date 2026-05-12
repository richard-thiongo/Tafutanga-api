const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthRepository = require('./auth.repository');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Business logic for auth
const AuthService = {
  // Signup logic
  async signup(landlordData) {
    const existing = await AuthRepository.findByEmail(landlordData.email);
    if (existing) throw new Error('Email already registered');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(landlordData.password, salt);

    const newUser = await AuthRepository.create({
      ...landlordData,
      password: hashedPassword
    });

    return this.generateTokens(newUser.id);
  },

  // Signin logic
  async signin(email, password) {
    const landlord = await AuthRepository.findByEmail(email);
    if (!landlord) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, landlord.password);
    if (!isMatch) throw new Error('Invalid credentials');

    return this.generateTokens(landlord.id);
  },

  // Refresh logic
  async refreshToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
      return this.generateTokens(decoded.id);
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  },

  generateTokens(id) {
    const accessToken = jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }
};

module.exports = AuthService;
