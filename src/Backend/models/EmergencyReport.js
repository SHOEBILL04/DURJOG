// Backend/models/EmergencyReport.js
const mongoose = require('mongoose');

const emergencyReportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['flood', 'earthquake', 'fire', 'medical', 'blood', 'other']
  },
  description: String,
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  userId: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'false alarm'],
    default: 'active'
  }
});

module.exports = mongoose.model('EmergencyReport', emergencyReportSchema);