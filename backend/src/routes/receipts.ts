import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { authGuard } from '../middlewares/auth';
import {
  createReceipt,
  listReceipts,
  getReceipt,
  updateReceipt,
  deleteReceipt,
  monthlySummary
} from '../controllers/receiptController';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
const storage = multer.diskStorage({
  destination: (_req, file, cb) => cb(null, path.join(process.cwd(), uploadDir)),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  }
});
const upload = multer({ storage });

// create
router.post('/', authGuard, upload.single('image'), createReceipt);

// list
router.get('/', authGuard, listReceipts);

// summary (place before :id)
router.get('/summary/monthly', authGuard, monthlySummary);

// single, update, delete
router.get('/:id', authGuard, getReceipt);
router.put('/:id', authGuard, upload.single('image'), updateReceipt);
router.delete('/:id', authGuard, deleteReceipt);

export default router;
