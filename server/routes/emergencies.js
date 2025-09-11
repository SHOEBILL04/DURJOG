const express = require('express');
const router = express.Router();
const Emergency = require('../models/Emergency');
const auth = require('../middleware/auth');

// Get all emergencies
router.get('/', async (req, res) => {
  try {
    const emergencies = await Emergency.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(100);
    
    res.json({ emergencies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new emergency report
router.post('/', auth, async (req, res) => {
  try {
    const emergency = new Emergency({
      ...req.body,
      reportedBy: req.user.id
    });
    
    const savedEmergency = await emergency.save();
    res.status(201).json({ emergency: savedEmergency });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an emergency report
router.patch('/:id', auth, async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id);
    
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }
    
    // Check if user is the reporter or admin
    if (emergency.reportedBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    Object.keys(req.body).forEach(key => {
      emergency[key] = req.body[key];
    });
    
    const updatedEmergency = await emergency.save();
    res.json({ emergency: updatedEmergency });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an emergency report
router.delete('/:id', auth, async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id);
    
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }
    
    // Check if user is the reporter or admin
    if (emergency.reportedBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Emergency.findByIdAndDelete(req.params.id);
    res.json({ message: 'Emergency deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;