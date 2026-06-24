const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configurations
app.use(cors());
app.use(express.json());

// Absolute Standalone Database Connection Routing Engine
const localMongoURI = 'mongodb://127.0.0.1:27017/plant2tree_healthcare';

mongoose.connect(localMongoURI)
  .then(() => console.log('[Backend]: Success! Locally bound MongoDB core engine successfully mounted.'))
  .catch((err) => console.error(`[Backend Critical]: Database connection refused at target coordinate: ${err}`));

// Mock Schema Storage Layer for Core Records Mapping
const PatientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  condition: { type: String, required: true },
  lastVisit: { type: String, default: () => new Date().toISOString().split('T')[0] }
});
const Patient = mongoose.model('Patient', PatientSchema);

// API Secure Endpoint Maps
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@plant2tree.com' && password === 'admin123') {
    return res.status(200).json({
      success: true,
      message: 'Authentication validated successfully.',
      data: {
        token: 'p2t_crypto_secure_session_token_allocation',
        user: { name: 'Dr. RK Admin', email: 'admin@plant2tree.com', role: 'ClinicAdmin' }
      }
    });
  }
  return res.status(401).json({ success: false, message: 'Invalid Administrative Credentials.' });
});

// Static Production UI Delivery Router Anchor
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[Backend Channel]: Server actively humming on isolated port: ${PORT}`);
});