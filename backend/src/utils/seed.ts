import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart_receipts_db');
  const existing = await User.findOne({ email: 'test@local' });
  if (existing) {
    console.log('Seed user exists:', existing.email);
    process.exit(0);
  }
  const u = new User({ email: 'test@local', password: 'password123', name: 'Test User' });
  await u.save();
  console.log('Created seed user: test@local / password123');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
