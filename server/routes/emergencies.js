// routes/emergencies.js
import express from 'express';
import Emergency from '../models/Emergency.js';

const router = express.Router();

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

// Create a new emergency report (without auth for now)
router.post('/', async (req, res) => {
  try {
    const emergency = new Emergency({
      ...req.body,
      reportedBy: 'anonymous-user' // Temporary for testing
    });
    
    const savedEmergency = await emergency.save();
    res.status(201).json({ 
      message: 'Emergency reported successfully!',
      emergency: savedEmergency 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an emergency report (without auth for now)
router.patch('/:id', async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id);
    
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
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

// Delete an emergency report (without auth for now)
router.delete('/:id', async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id);
    
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency not found' });
    }
    
    await Emergency.findByIdAndDelete(req.params.id);
    res.json({ message: 'Emergency deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Emergencies API is working!', timestamp: new Date().toISOString() });
});

export default router;