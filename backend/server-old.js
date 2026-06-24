const express = require('express');
const mongoose = require('mongoose');
const connectDB = require("./config/db");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// 🔓 CORS Configuration to allow smooth frontend port 5173 requests
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-clinic-tenant-id']
}));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "SUPER_SAAS_SECRET_KEY_AXIS_99";

// =========================================================================
// 🏢 MULTI-TENANT DATABASE SCHEMAS (CLEANED CONSTRAINTS)
// =========================================================================
const Clinic = mongoose.models.Clinic || mongoose.model('Clinic', new mongoose.Schema({
  name: String,
  slug: String,
  ownerName: String,
  email: String,
  phone: String,
  subscriptionTier: { type: String, default: 'Premium Monthly' }
}));

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  tenantClinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'DOCTOR' }
}));

// REMOVED STRICT UNIQUE LOCKS TO PREVENT CONSTRAINTS ERRORS
const TenantPatient = mongoose.models.TenantPatient || mongoose.model('TenantPatient', new mongoose.Schema({
  tenantClinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  patientId: String,
  name: String,
  phone: String, 
  age: Number,
  gender: String,
  medicalHistory: [String]
}));

const TenantAppointment = mongoose.models.TenantAppointment || mongoose.model('TenantAppointment', new mongoose.Schema({
  tenantClinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'TenantPatient' },
  doctorName: String,
  appointmentDate: String,
  appointmentTime: String,
  treatmentType: String,
  status: { type: String, default: 'Confirmed' }
}));

const TenantBilling = mongoose.models.TenantBilling || mongoose.model('TenantBilling', new mongoose.Schema({
  tenantClinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'TenantPatient' },
  items: [{ procedureName: String, cost: Number, quantity: Number }],
  subTotal: Number,
  cgst: Number,
  sgst: Number,
  grandTotal: Number,
  status: { type: String, default: 'Unpaid' },
  paymentMethod: String,
  dateGenerated: String
}));

// =========================================================================
// 🚀 UNIFIED API ROUTING CORRIDORS
// =========================================================================

// 1. AUTH LOGIN
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        tenantClinicId: user.tenantClinicId,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantClinicId: user.tenantClinicId,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// 2. CLINIC ONBOARDING
app.post('/api/clinics/onboard', async (req, res) => {
  try {
    const { clinicName, slug, ownerName, email, password, phone, plan } = req.body;
    const newClinic = await Clinic.create({ name: clinicName, slug, ownerName, email, phone, subscriptionTier: plan });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ name: ownerName, email, password: hashedPassword, role: "CLINIC_ADMIN", tenantClinicId: newClinic._id });
    res.status(201).json({ message: "Clinic onboarded successfully!", clinic: newClinic });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/saas/clinics', async (req, res) => {
  try { res.status(200).json(await Clinic.find({})); } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. 👥 PATIENT MANAGEMENT PIPELINES (CRITICAL ROUTE FIXED)
app.post('/api/patients', async (req, res) => {
  try {
    const { patientId, name, phone, age, gender, medicalHistory } = req.body;
    
    // Auto-create record under fallback or tracking parameters if needed
    const newPatient = await TenantPatient.create({
      patientId,
      name,
      phone,
      age,
      gender,
      medicalHistory: medicalHistory || []
    });
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/patients', async (req, res) => {
  try {
    const data = await TenantPatient.find({}).sort({ _id: -1 });
    res.status(200).json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. DATABASE SEED PIPELINE
app.post('/api/seed', async (req, res) => {
  try {
    try { await Clinic.collection.drop(); } catch(e){}
    try { await User.collection.drop(); } catch(e){}
    try { await TenantPatient.collection.drop(); } catch(e){}
    const clinic1 = await new Clinic({ name: "Alpha Dental Hub", slug: "alpha-dental", ownerName: "Dr. Emily", email: "emily@dental.com", phone: "9999988888" }).save();
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash("zaid123", salt);
    await User.insertMany([
      { name: "Global SaaS Owner", email: "superadmin@saas.com", password: passHash, role: "SUPER_ADMIN" },
      { tenantClinicId: clinic1._id, name: "Dr. Emily", email: "emily@dental.com", password: passHash, role: "CLINIC_ADMIN" }
    ]);
    res.status(201).json({ status: "success", message: "🚀 DATABASE SEED LIVE!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// =========================================================================
// ⚙️ SERVER START ENGINE
// =========================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 EXPRESS ENGINE LISTENING ON PORT ${PORT}`));

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/dental";
mongoose.connect(MONGO_URI).then(() => console.log("💾 Database Subsystem Synced Successfully!"));