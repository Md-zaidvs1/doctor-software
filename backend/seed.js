const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor-software';

async function seedUser() {
  try {
    console.log('Connecting to Atlas Cluster Database...');
    await mongoose.connect(MONGO_URI);
    
    const usersCollection = mongoose.connection.collection('users');

    console.log('Purging old mismatched doctor accounts...');
    await usersCollection.deleteMany({ email: "doctor@apex.com" });

    // Generate secure password hash matching your backend structure
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const verifiedDoctor = {
      name: "Dr. Shahih",
      email: "doctor@apex.com",
      password: hashedPassword, 
      role: "Doctor",         // Explicitly capitalized to match your restrictTo("Doctor") checks!
      clinicId: "clinic-alpha-77", // Explicitly declared for tenant workspace mapping
      createdAt: new Date()
    };

    // Insert clean user doc
    await usersCollection.insertOne(verifiedDoctor);
    
    console.log('--------------------------------------------------');
    console.log('SUCCESS: Production-Grade Doctor Account Injected!');
    console.log('Email: doctor@apex.com');
    console.log('Password: password123');
    console.log('Role Match: Doctor | Clinic ID Match: clinic-alpha-77');
    console.log('--------------------------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding engine hit an error:', error);
    process.exit(1);
  }
}

seedUser();