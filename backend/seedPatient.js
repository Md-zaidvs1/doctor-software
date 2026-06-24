const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doctor-software';

async function seedPatient() {
  try {
    console.log('Connecting to Database to add test patient...');
    await mongoose.connect(MONGO_URI);
    
    const patientsCollection = mongoose.connection.collection('patients');

    // Create a mock patient linked directly to your seeded clinic ID
    const testPatient = {
      name: "John Doe",
      phone: "+1 555-0199",
      fileNumber: "A-001",
      clinicId: "clinic-alpha-77", // Must match the doctor's clinicId perfectly!
      createdAt: new Date()
    };

    // Insert into database
    const result = await patientsCollection.insertOne(testPatient);
    
    console.log('--------------------------------------------------');
    console.log('SUCCESS: Test Patient Successfully Injected!');
    console.log(`Patient Name: ${testPatient.name}`);
    console.log(`Assigned ID: ${result.insertedId}`);
    console.log(`Clinic Workspace Link: ${testPatient.clinicId}`);
    console.log('--------------------------------------------------');
    
    process.exit(0);
  } catch (error) {
    console.error('Patient injection failed:', error);
    process.exit(1);
  }
}

seedPatient();