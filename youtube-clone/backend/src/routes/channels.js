import { Router } from "express";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/", authRequired, async (req,res)=>{
  try{
    const { channelName, description, channelBanner } = req.body;
    const chan = await Channel.create({ channelName, description, channelBanner, owner: req.user.id });
    res.status(201).json(chan);
  }catch(e){ res.status(500).json({message:e.message}); }
});

router.get("/:id", async (req,res)=>{
  const chan = await Channel.findById(req.params.id).populate("owner", "username");
  if(!chan) return res.status(404).json({message:"Not found"});
  res.json(chan);
});

router.patch("/:id", authRequired, async (req,res)=>{
  const chan = await Channel.findById(req.params.id);
  if(!chan) return res.status(404).json({message:"Not found"});
  if(String(chan.owner) !== req.user.id) return res.status(403).json({message:"Forbidden"});
  Object.assign(chan, req.body);
  await chan.save();
  res.json(chan);
});

router.delete("/:id", authRequired, async (req,res)=>{
  const chan = await Channel.findById(req.params.id);
  if(!chan) return res.status(404).json({message:"Not found"});
  if(String(chan.owner) !== req.user.id) return res.status(403).json({message:"Forbidden"});
  await chan.deleteOne();
  res.json({message:"Deleted"});
});

router.get("/:id/videos", async (req,res)=>{
  const vids = await Video.find({ channel: req.params.id }).sort({ createdAt:-1 });
  res.json(vids);
});

export default router;
