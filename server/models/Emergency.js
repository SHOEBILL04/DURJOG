// models/Emergency.js
import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['flood', 'earthquake', 'blood', 'fire', 'medical', 'other']
  },
  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  description: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  reportedBy: {
    type: String,
    default: 'anonymous'
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'false_alarm'],
    default: 'active'
  },
  contactInfo: {
    name: String,
    phone: String,
    email: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Emergency', emergencySchema);