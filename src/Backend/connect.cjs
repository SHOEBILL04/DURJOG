require('dotenv').config({ path: './config.env' });
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/durjogdb';

// Improved MongoDB connection with better error handling
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Emergency Report Schema
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

const EmergencyReport = mongoose.model('EmergencyReport', emergencyReportSchema);

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// User routes
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Username or email already exists' });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      token, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/user/profile', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      username: user.username,
      email: user.email,
      id: user._id
    });
  } catch (err) {
    console.error('Error in profile route:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Emergency Report routes
app.post('/api/emergency-reports', auth, async (req, res) => {
  try {
    const { type, description, urgency, location } = req.body;
    
    // Validate required fields
    if (!type || !location || !location.latitude || !location.longitude) {
      return res.status(400).json({ 
        message: 'Missing required fields: type and location are required' 
      });
    }
    
    const report = new EmergencyReport({
      type,
      description,
      urgency: urgency || 'medium',
      location,
      userId: req.userId,
      status: 'active'
    });
    
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    console.error('Error saving emergency report:', err);
    res.status(500).json({ message: 'Server error while saving report' });
  }
});

app.get('/api/emergency-reports', async (req, res) => {
  try {
    const reports = await EmergencyReport.find({ status: 'active' })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(reports || []);
  } catch (err) {
    console.error('Error fetching emergency reports:', err);
    res.status(500).json({ message: 'Server error while fetching reports' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint to check if emergency reports collection exists and is accessible
app.get('/api/test-reports', async (req, res) => {
  try {
    // Try to count documents in the emergencyreports collection
    const count = await EmergencyReport.countDocuments();
    res.json({ 
      success: true, 
      count,
      message: 'Emergency reports collection is accessible' 
    });
  } catch (err) {
    console.error('Error accessing emergency reports collection:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error accessing emergency reports collection',
      error: err.message 
    });
  }
});
app.delete('/api/emergency-reports/:id', auth, async (req, res) => {
  try {
    const report = await EmergencyReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Convert both IDs to string for proper comparison
    const reportUserId = report.userId.toString();
    const requestingUserId = req.userId.toString();
    
    // Check if the user is the owner of the report
    if (reportUserId !== requestingUserId) {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }
    
    await EmergencyReport.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    console.error('Error deleting emergency report:', err);
    res.status(500).json({ message: 'Server error while deleting report' });
  }
});