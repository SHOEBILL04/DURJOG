require('dotenv').config({ path: './config.env' });
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');

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

// Email transporter setup
const isProduction = process.env.NODE_ENV === 'production';

let transporter;
if (isProduction) {
  // Real email setup for production
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
} else {
  // Mock email setup for development
  transporter = {
    sendMail: async (mailOptions) => {
      console.log('📧 Mock Email Sent:');
      console.log('To:', mailOptions.to);
      console.log('Subject:', mailOptions.subject);
      console.log('Reset Code:', mailOptions.html.match(/\d{6}/)?.[0] || 'No code found');
      console.log('---');
      return { messageId: 'mock-message-id' };
    }
  };
}

// User Schema with reset token fields
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: String,
  resetTokenExpiry: Date
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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
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

// Generate random 6-digit code
function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send email function
async function sendResetEmail(email, resetCode) {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@durjog.com',
    to: email,
    subject: 'Durjog Password Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">Durjog Password Reset</h2>
        <p>You requested to reset your password. Use the following verification code:</p>
        <div style="background: #f8f9fa; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #667eea; margin: 0; font-size: 2.5em;">${resetCode}</h1>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
        <hr>
        <p style="color: #666; font-size: 0.9em;">Durjog Emergency Response System</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reset code sent to:', email, 'Code:', resetCode);
    
    // For development, also log the code to console
    if (!isProduction) {
      console.log('🔑 DEVELOPMENT MODE: Reset code for', email, 'is:', resetCode);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Even if email fails, we'll still return success in development
    if (!isProduction) {
      console.log('🔑 DEVELOPMENT MODE: Reset code for', email, 'would be:', resetCode);
      return true;
    }
    
    return false;
  }
}

// ==================== AUTHENTICATION MIDDLEWARE ====================
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Token is not valid - user not found' });
    }
    
    // Add user info to request
    req.userId = decoded.userId;
    req.user = user;
    
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

// ==================== USER ROUTES ====================
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

// Forgot Password - Send reset code
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    
    // For security, don't reveal if email exists
    if (!user) {
      return res.status(200).json({ 
        success: true,
        message: 'If this email is registered, you will receive a reset code shortly.'
      });
    }

    // Generate reset code and expiry
    const resetCode = generateResetCode();
    const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save to user document
    user.resetToken = resetCode;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send email
    const emailSent = await sendResetEmail(email, resetCode);
    
    if (emailSent) {
      res.status(200).json({ 
        success: true,
        message: 'Password reset code has been sent to your email.'
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: 'Failed to send email. Please try again later.'
      });
    }
    
  } catch (err) {
    console.error('Error in forgot password:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error processing your request' 
    });
  }
});

// Verify reset code
app.post('/verify-reset-code', async (req, res) => {
  const { email, code } = req.body;
  
  try {
    const user = await User.findOne({ 
      email, 
      resetToken: code,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired reset code.' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Reset code verified successfully.' 
    });
    
  } catch (err) {
    console.error('Error verifying reset code:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error verifying code' 
    });
  }
});

// Reset password with verified code
app.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  
  try {
    const user = await User.findOne({ 
      email, 
      resetToken: code,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired reset code.' 
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ 
      success: true,
      message: 'Password reset successfully. You can now login with your new password.' 
    });
    
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error resetting password' 
    });
  }
});

app.get('/api/user/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
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

// ==================== EMERGENCY REPORT ROUTES ====================
app.post('/api/emergency-reports', auth, async (req, res) => {
  try {
    const { type, description, urgency, location } = req.body;
    
    console.log('Creating emergency report for user:', req.userId);
    console.log('Report data:', { type, description, urgency, location });
    
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
    console.log('Report saved successfully:', report);
    
    res.status(201).json(report);
  } catch (err) {
    console.error('Error saving emergency report:', err);
    res.status(500).json({ message: 'Server error while saving report' });
  }
});

app.get('/api/emergency-reports', async (req, res) => {
  try {
    const reports = await EmergencyReport.find({ status: 'active' })
      .populate('userId', 'username email')
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(reports || []);
  } catch (err) {
    console.error('Error fetching emergency reports:', err);
    res.status(500).json({ message: 'Server error while fetching reports' });
  }
});

// Get reports for specific user
app.get('/api/emergency-reports/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if user is requesting their own reports
    if (userId !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these reports' });
    }
    
    const reports = await EmergencyReport.find({ userId })
      .sort({ timestamp: -1 });
    
    res.json(reports || []);
  } catch (err) {
    console.error('Error fetching user reports:', err);
    res.status(500).json({ message: 'Server error while fetching user reports' });
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
    
    console.log('Report user ID:', reportUserId);
    console.log('Requesting user ID:', requestingUserId);
    
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

// Add this at the very end of connect.cjs
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('=== SERVER STARTED SUCCESSFULLY ===');
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log('===================================');
}).on('error', (err) => {
  console.error('Server failed to start:', err);
});