const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Staff = require('./models/Staff');

const seedDeveloperAccount = async () => {
  try {
    const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/healthcare-saas'; 
    await mongoose.connect(dbURI);
    console.log(`Connected to: ${dbURI}`);

    const email = 'superadmin@saas.com';
    // Clear out old attempts to maintain a clean directory
    await Staff.deleteMany({ email }); 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@2026', salt);

    const developer = new Staff({
      clinicId: '6a391e7b5d9d49d512d572d6', // Links to the live Apex Dental Hub ID we verified
      name: 'Master Developer Admin',
      email: email,
      password: hashedPassword,
      phone: '0000000000',
      role: 'Admin', // Uses your valid enum choice
      isActive: true,
    });

    await developer.save();
    console.log('🚀 Account seeded completely without model errors!');
    console.log('Email: superadmin@saas.com | Password: Admin@2026');
    process.exit(0);
  } catch (error) {
    console.error('Validation seeding broke:', error);
    process.exit(1);
  }
};

seedDeveloperAccount();