import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth';
import receiptRoutes from './routes/receipts';
import { ensureUploadDir } from './utils/fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

ensureUploadDir(process.env.UPLOAD_DIR || 'uploads');

app.use('/uploads', express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')));

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);  // ← FIXED
    console.log("🍃 MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/receipts', receiptRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
