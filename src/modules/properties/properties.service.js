const PropertiesRepository = require('./properties.repository');
const cloudinary = require('../../config/cloudinary');
const sharp = require('sharp');
require('dotenv').config();

// Business logic for properties
const PropertiesService = {
  // Helper to upload to Cloudinary with optional compression
  async uploadImage(file) {
    let buffer = file.buffer;

    // If file is larger than 500KB, compress it
    if (file.size > 500 * 1024) {
      try {
        buffer = await sharp(file.buffer)
          .rotate() // Auto-rotate based on EXIF data
          .resize(1600, 1600, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ quality: 80, mozjpeg: true })
          .toBuffer();
      } catch (err) {
        console.error('Compression failed, uploading original:', err);
        // Fallback to original buffer if sharp fails
        buffer = file.buffer;
      }
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'tafutanga',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            return reject(new Error(`Image upload failed: ${error.message}`));
          }
          resolve(result.secure_url);
        }
      );

      uploadStream.end(file.buffer);
    });
  },

  async registerUnit(landlordId, unitData) {
    return await PropertiesRepository.createUnit(landlordId, unitData);
  },

  async updateUnit(landlordId, unitId, unitData) {
    const isOwner = await PropertiesRepository.checkUnitOwnership(unitId, landlordId);
    if (!isOwner) throw new Error('Unauthorized unit access');
    return await PropertiesRepository.updateUnit(unitId, unitData);
  },

  async deleteUnit(landlordId, unitId) {
    const isOwner = await PropertiesRepository.checkUnitOwnership(unitId, landlordId);
    if (!isOwner) throw new Error('Unauthorized unit access');
    return await PropertiesRepository.deleteUnit(unitId);
  },

  async getMyUnits(landlordId) {
    return await PropertiesRepository.findUnitsByLandlord(landlordId);
  },

  async postRoom(landlordId, unitId, roomData, file) {
    const isOwner = await PropertiesRepository.checkUnitOwnership(unitId, landlordId);
    if (!isOwner) throw new Error('Unauthorized unit access');
    
    if (file) {
      roomData.imageUrl = await this.uploadImage(file);
    }
    
    return await PropertiesRepository.createRoom(unitId, roomData);
  },

  async updateListing(landlordId, roomId, roomData, file) {
    const isOwner = await PropertiesRepository.checkRoomOwnership(roomId, landlordId);
    if (!isOwner) throw new Error('Unauthorized listing access');

    if (file) {
      roomData.imageUrl = await this.uploadImage(file);
    }

    return await PropertiesRepository.updateRoom(roomId, roomData);
  },

  async deleteListing(landlordId, roomId) {
    const isOwner = await PropertiesRepository.checkRoomOwnership(roomId, landlordId);
    if (!isOwner) throw new Error('Unauthorized listing access');

    return await PropertiesRepository.deleteRoom(roomId);
  },

  async getMyListings(landlordId) {
    return await PropertiesRepository.findRoomsByLandlord(landlordId);
  },

  async getAllListings(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    return await PropertiesRepository.findAllAvailable(limit, offset);
  }
};

module.exports = PropertiesService;
