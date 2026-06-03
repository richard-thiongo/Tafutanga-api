const { pool } = require('../../config/database');

// Data access for units and rooms
const PropertiesRepository = {
  // Create a unit
  async createUnit(landlordId, unitData) {
    const { county, place, unitName } = unitData;
    const { rows } = await pool.query(
      'INSERT INTO units (landlord_id, county, place, unit_name) VALUES ($1, $2, $3, $4) RETURNING *',
      [landlordId, county, place, unitName]
    );
    return rows[0];
  },

  // Update a unit
  async updateUnit(unitId, unitData) {
    const { county, place, unitName } = unitData;
    const { rows } = await pool.query(
      'UPDATE units SET county = $1, place = $2, unit_name = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [county, place, unitName, unitId]
    );
    return rows[0];
  },

  // Delete a unit and its rooms
  async deleteUnit(unitId) {
    // Assuming rooms have a foreign key to units
    // If ON DELETE CASCADE is not set, we manually delete rooms first
    await pool.query('DELETE FROM rooms WHERE unit_id = $1', [unitId]);
    await pool.query('DELETE FROM units WHERE id = $1', [unitId]);
  },

  // Fetch all units owned by a landlord
  async findUnitsByLandlord(landlordId) {
    const { rows } = await pool.query(
      'SELECT id, unit_name, county, place FROM units WHERE landlord_id = $1 ORDER BY unit_name ASC',
      [landlordId]
    );
    return rows;
  },

  // Create a room listing
  async createRoom(unitId, roomData) {
    const { roomType, roomsAvailable, price, imageUrl, description } = roomData;
    const { rows } = await pool.query(
      'INSERT INTO rooms (unit_id, room_type, rooms_available, price, image_url, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [unitId, roomType, roomsAvailable, price, imageUrl, description]
    );
    return rows[0];
  },

  // Update room
  async updateRoom(roomId, roomData) {
    const { roomType, roomsAvailable, price, imageUrl, description } = roomData;
    const { rows } = await pool.query(
      'UPDATE rooms SET room_type = $1, rooms_available = $2, price = $3, image_url = $4, description = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [roomType, roomsAvailable, price, imageUrl, description, roomId]
    );
    return rows[0];
  },

  // Delete room
  async deleteRoom(roomId) {
    await pool.query('DELETE FROM rooms WHERE id = $1', [roomId]);
  },

  // Fetch rooms by landlord
  async findRoomsByLandlord(landlordId) {
    const { rows } = await pool.query(
      `SELECT r.*, u.unit_name, u.county, u.place 
       FROM rooms r
       JOIN units u ON r.unit_id = u.id
       WHERE u.landlord_id = $1
       ORDER BY r.created_at DESC`,
      [landlordId]
    );
    return rows;
  },

  // Fetch a specific room by ID
  async findRoomById(roomId) {
    const { rows } = await pool.query(
      'SELECT * FROM rooms WHERE id = $1',
      [roomId]
    );
    return rows[0];
  },

  // Check room ownership
  async checkRoomOwnership(roomId, landlordId) {
    const { rows } = await pool.query(
      `SELECT r.id FROM rooms r
       JOIN units u ON r.unit_id = u.id
       WHERE r.id = $1 AND u.landlord_id = $2`,
      [roomId, landlordId]
    );
    return rows.length > 0;
  },

  // Check unit ownership
  async checkUnitOwnership(unitId, landlordId) {
    const { rows } = await pool.query(
      'SELECT id FROM units WHERE id = $1 AND landlord_id = $2',
      [unitId, landlordId]
    );
    return rows.length > 0;
  },

  // Fetch all available rooms (Public) - with pagination
  async findAllAvailable(limit = 20, offset = 0) {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM rooms r
       JOIN units u ON r.unit_id = u.id
       JOIN landlord l ON u.landlord_id = l.id
       WHERE r.rooms_available > 0 AND l.is_paused = false`
    );
    const totalItems = parseInt(countResult.rows[0].count, 10);

    const { rows } = await pool.query(
      `SELECT r.*, u.unit_name, u.county, u.place, l.full_name as landlord_name, l.phone_number as contact
       FROM rooms r
       JOIN units u ON r.unit_id = u.id
       JOIN landlord l ON u.landlord_id = l.id
       WHERE r.rooms_available > 0 AND l.is_paused = false
       ORDER BY r.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return { data: rows, totalItems };
  }
};

module.exports = PropertiesRepository;
