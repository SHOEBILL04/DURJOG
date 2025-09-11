// Backend/routes/emergencyReports.js
const express = require('express');
const router = express.Router();
const EmergencyReport = require('../models/EmergencyReport');

// Get all emergency reports
router.get('/', async (req, res) => {
  try {
    const reports = await EmergencyReport.find().sort({ timestamp: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new emergency report
router.post('/', async (req, res) => {
  try {
    const report = new EmergencyReport({
      type: req.body.type,
      description: req.body.description,
      urgency: req.body.urgency,
      location: req.body.location,
      userId: req.body.userId,
      timestamp: req.body.timestamp,
      status: req.body.status
    });

    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;