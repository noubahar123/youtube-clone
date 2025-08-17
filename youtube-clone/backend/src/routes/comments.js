import { Router } from "express";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/:videoId", async (req,res)=>{
  const comments = await Comment.find({ video: req.params.videoId }).populate("user", "username").sort({createdAt:-1});
  res.json(comments);
});

router.post("/:videoId", authRequired, async (req,res)=>{
  const v = await Video.findById(req.params.videoId);
  if(!v) return res.status(404).json({message:"Video not found"});
  const c = await Comment.create({ video: v._id, user: req.user.id, text: req.body.text });
  res.status(201).json(c);
});

router.patch("/:commentId", authRequired, async (req,res)=>{
  const c = await Comment.findById(req.params.commentId);
  if(!c) return res.status(404).json({message:"Not found"});
  if(String(c.user) != req.user.id) return res.status(403).json({message:"Forbidden"});
  c.text = req.body.text ?? c.text;
  await c.save();
  res.json(c);
});

router.delete("/:commentId", authRequired, async (req,res)=>{
  const c = await Comment.findById(req.params.commentId);
  if(!c) return res.status(404).json({message:"Not found"});
  if(String(c.user) != req.user.id) return res.status(403).json({message:"Forbidden"});
  await c.deleteOne();
  res.json({message:"Deleted"});
});

export default router;
