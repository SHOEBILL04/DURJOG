require('dotenv').config({ path: './config.env' });
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

const app = express();

// 🔧 CORS Middleware with Logging
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('→ Incoming Origin:', origin);

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    console.log('❌ Origin not allowed:', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    console.log('⚙️ Handling preflight (OPTIONS) request');
    return res.sendStatus(200); // Ends preflight request early
  }

  next();
});

// 🪵 Request Logger (for Debugging)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// 🚀 Body Parser and Routes
app.use(express.json());
app.use('/api/auth', authRoutes);

// 📦 MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/durjogdb';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// 🎯 Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
