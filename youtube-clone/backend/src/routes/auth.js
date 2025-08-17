import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../config/appConfig.js";

const router = Router();

router.post("/register", async (req, res)=>{
  try{
    const { username, email, password } = req.body;
    if(!username || !email || !password) return res.status(400).json({message:"All fields required"});
    const existing = await User.findOne({ $or: [{email}, {username}] });
    if(existing) return res.status(409).json({message:"User already exists"});
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    return res.status(201).json({ id:user._id, username:user.username, email:user.email });
  }catch(e){ res.status(500).json({message:e.message}); }
});

router.post("/login", async (req, res)=>{
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({message:"Invalid credentials"});
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(401).json({message:"Invalid credentials"});
    const token = jwt.sign({ id:user._id, username:user.username }, JWT_SECRET, { expiresIn:"7d" });
    res.json({ token, user: { id:user._id, username:user.username, email:user.email } });
  }catch(e){ res.status(500).json({message:e.message}); }
});

export default router;
