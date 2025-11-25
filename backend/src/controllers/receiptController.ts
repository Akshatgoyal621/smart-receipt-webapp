import type {Request, Response} from "express";
import Receipt from "../models/Receipt";
import dotenv from "dotenv";
dotenv.config();

type AuthReq = Request & {user?: {id: string}; file?: Express.Multer.File};

export const createReceipt = async (req: AuthReq, res: Response) => {
  try {
    const {title, amount, category, date, notes} = req.body;
    if (!title || !amount)
      return res.status(400).json({message: "title and amount required"});

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const r = new Receipt({
      user: req.user!.id,
      title,
      amount: Number(amount),
      category: category || "uncategorized",
      date: date ? new Date(date) : undefined,
      notes,
      imageUrl,
    });
    await r.save();
    return res.json(r);
  } catch (err) {
    console.error("createReceipt error", err);
    return res.status(500).json({message: "Server error"});
  }
};

export const listReceipts = async (req: AuthReq, res: Response) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || "1"));
    const limit = Math.min(100, parseInt((req.query.limit as string) || "10"));
    const q: any = {user: req.user!.id};

    if (req.query.search)
      q.title = {$regex: req.query.search as string, $options: "i"};
    if (req.query.category) q.category = req.query.category as string;
    if (req.query.from || req.query.to) {
      q.date = {};
      if (req.query.from) q.date.$gte = new Date(req.query.from as string);
      if (req.query.to) q.date.$lte = new Date(req.query.to as string);
    }

    const total = await Receipt.countDocuments(q);
    const receipts = await Receipt.find(q)
      .sort({date: -1})
      .skip((page - 1) * limit)
      .limit(limit);
    return res.json({receipts, total, page, limit});
  } catch (err) {
    console.error("listReceipts error", err);
    return res.status(500).json({message: "Server error"});
  }
};

export const getReceipt = async (req: AuthReq, res: Response) => {
  try {
    const r = await Receipt.findById(req.params.id);
    if (!r) return res.status(404).json({message: "Not found"});
    if (r.user.toString() !== req.user!.id)
      return res.status(403).json({message: "Forbidden"});
    return res.json(r);
  } catch (err) {
    console.error("getReceipt error", err);
    return res.status(500).json({message: "Server error"});
  }
};

export const updateReceipt = async (req: AuthReq, res: Response) => {
  try {
    const r = await Receipt.findById(req.params.id);
    if (!r) return res.status(404).json({message: "Not found"});
    if (r.user.toString() !== req.user!.id)
      return res.status(403).json({message: "Forbidden"});

    const {title, amount, category, date, notes} = req.body;
    if (title !== undefined) r.title = title;
    if (amount !== undefined) r.amount = Number(amount);
    if (category !== undefined) r.category = category;
    if (date !== undefined) r.date = new Date(date);
    if (notes !== undefined) r.notes = notes;
    if (req.file) r.imageUrl = `/uploads/${req.file.filename}`;

    await r.save();
    return res.json(r);
  } catch (err) {
    console.error("updateReceipt error", err);
    return res.status(500).json({message: "Server error"});
  }
};

export const deleteReceipt = async (req: AuthReq, res: Response) => {
  try {
    const r = await Receipt.findById(req.params.id);
    if (!r) return res.status(404).json({message: "Not found"});

    if (r.user.toString() !== req.user!.id) {
      return res.status(403).json({message: "Forbidden"});
    }

    await r.deleteOne(); // <-- correct method in Mongoose 7

    return res.json({message: "Deleted"});
  } catch (err) {
    console.error("deleteReceipt error", err);
    return res.status(500).json({message: "Server error"});
  }
};

export const monthlySummary = async (req: AuthReq, res: Response) => {
  try {
    const userId = req.user!.id;
    const months = 6;
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

    // import mongoose here to avoid circular issues
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mongoose = require("mongoose");

    const agg = await Receipt.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: {$gte: start},
        },
      },
      {
        $group: {
          _id: {year: {$year: "$date"}, month: {$month: "$date"}},
          total: {$sum: "$amount"},
          count: {$sum: 1},
        },
      },
      {$sort: {"_id.year": 1, "_id.month": 1}},
    ]);

    return res.json({data: agg});
  } catch (err) {
    console.error("monthlySummary error", err);
    return res.status(500).json({message: "Server error"});
  }
};
