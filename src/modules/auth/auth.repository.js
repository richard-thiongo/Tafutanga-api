const { pool } = require('../../config/database');

// Data access logic for landlords
const AuthRepository = {
  // Finds landlord by email
  async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM landlord WHERE email = $1',
      [email]
    );
    return rows[0];
  },

  // Creates new landlord
  async create(landlord) {
    const { fullName, phoneNumber, email, password } = landlord;
    const { rows } = await pool.query(
      'INSERT INTO landlord (full_name, phone_number, email, password) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email',
      [fullName, phoneNumber, email, password]
    );
    return rows[0];
  }
};

module.exports = AuthRepository;
