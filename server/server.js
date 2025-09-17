import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./db/connect.js";
import contactRoutes from "./routes/contactRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import emergencyRoutes from "./routes/emergencies.js"; // Make sure to import your emergency routes

dotenv.config();

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/durjog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/updates", newsRoutes);
app.use("/api/emergencies", emergencyRoutes); // Add this line for emergency routes

// Add a test endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));