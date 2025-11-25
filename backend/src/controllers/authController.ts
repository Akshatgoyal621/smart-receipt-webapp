import type {Request, Response} from "express";
import jwt, {SignOptions, Secret} from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User";
dotenv.config();

const JWT_SECRET: Secret =
  (process.env.JWT_SECRET as string) || "change_this_secret";
// help TS understand this value is valid for SignOptions.expiresIn
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || "7d";

export const register = async (req: Request, res: Response) => {
  try {
    const {email, password, name} = req.body;
    if (!email || !password)
      return res.status(400).json({message: "Email and password required"});

    const existing = await User.findOne({email});
    if (existing)
      return res.status(400).json({message: "Email already in use"});

    const u = new User({email, password, name});
    await u.save();

    const payload = {id: u._id.toString()}; // ensure id is primitive
    const options: SignOptions = {
      // cast through unknown -> SignOptions['expiresIn'] so TS stops complaining
      expiresIn: TOKEN_EXPIRES_IN as unknown as SignOptions["expiresIn"],
    };
    const token = jwt.sign(payload, JWT_SECRET, options);
    return res.json({token, user: {id: u._id, email: u.email, name: u.name}});
  } catch (err) {
    console.error("register error", err);
    return res.status(500).json({message: "Server error"});
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    if (!email || !password)
      return res.status(400).json({message: "Email and password required"});

    const u = await User.findOne({email});
    if (!u) return res.status(400).json({message: "Invalid credentials"});

    const ok = await u.comparePassword(password);
    if (!ok) return res.status(400).json({message: "Invalid credentials"});

    const payload = {id: u._id.toString()};
    const options: SignOptions = {
      // cast through unknown -> SignOptions['expiresIn'] so TS stops complaining
      expiresIn: TOKEN_EXPIRES_IN as unknown as SignOptions["expiresIn"],
    };
    const token = jwt.sign(payload, JWT_SECRET, options);
    return res.json({token, user: {id: u._id, email: u.email, name: u.name}});
  } catch (err) {
    console.error("login error", err);
    return res.status(500).json({message: "Server error"});
  }
};
