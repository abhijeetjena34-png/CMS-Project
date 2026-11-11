require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME } = process.env;

    if (!SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD || !SEED_ADMIN_NAME) {
      console.error(
        '❌ Missing seed credentials. Set SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, SEED_ADMIN_NAME in .env'
      );
      process.exit(1);
    }

    // Check if admin already exists
    const existing = await Admin.findOne({ email: SEED_ADMIN_EMAIL });
    if (existing) {
      console.log(`⚠️  Admin already exists with email: ${SEED_ADMIN_EMAIL}`);
      process.exit(0);
    }

    // Create admin (password is hashed by the pre-save hook in Admin model)
    const admin = await Admin.create({
      name: SEED_ADMIN_NAME,
      email: SEED_ADMIN_EMAIL,
      password: SEED_ADMIN_PASSWORD,
    });

    console.log(`✅ Admin created successfully!`);
    console.log(`   Name  : ${admin.name}`);
    console.log(`   Email : ${admin.email}`);
    console.log(`   ID    : ${admin._id}`);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedAdmin();

