import { Router } from "express";
import mongoose from "mongoose";
import Video from "../models/Video.js";
import Channel from "../models/Channel.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

function isId(id) {
  return mongoose.isValidObjectId(id);
}

/**
 * GET /api/videos
 * List videos with optional search & category, plus simple pagination
 * Query: q, category, page=1, limit=24
 */
router.get("/", async (req, res) => {
  try {
    const { q, category, page = 1, limit = 24 } = req.query;
    const cond = {};
    if (q) cond.title = { $regex: q, $options: "i" };
    if (category && category !== "All") cond.category = category;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(limit, 10) || 24, 1), 100);

    const [videos, total] = await Promise.all([
      Video.find(cond)
        .populate("channel", "channelName")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize),
      Video.countDocuments(cond),
    ]);

    res.json({ videos, total, page: pageNum, limit: pageSize });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * GET /api/videos/:id
 * Return one video and atomically increment views
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ message: "Invalid id" });

    const v = await Video.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("channel", "channelName owner");
    if (!v) return res.status(404).json({ message: "Not found" });

    res.json(v);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * POST /api/videos
 * Create a video (auth required). Ensures channel exists & belongs to user.
 */
router.post("/", authRequired, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, channelId, category = "All" } = req.body;
    if (!title || !videoUrl || !channelId) {
      return res.status(400).json({ message: "title, videoUrl, channelId required" });
    }

    if (!isId(channelId)) return res.status(400).json({ message: "Invalid channelId" });

    const ch = await Channel.findById(channelId);
    if (!ch) return res.status(400).json({ message: "Channel not found" });
    if (String(ch.owner) !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    const v = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      channel: channelId,
      uploader: req.user.id,
      category,
      // if your schema uses arrays for reactions, they default to []
    });

    res.status(201).json(v);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * PATCH /api/videos/:id
 * Only allow safe fields to be updated by uploader
 */
router.patch("/:id", authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ message: "Invalid id" });

    const v = await Video.findById(id);
    if (!v) return res.status(404).json({ message: "Not found" });
    if (String(v.uploader) !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    const allowed = ["title", "description", "videoUrl", "thumbnailUrl", "category"];
    for (const key of Object.keys(req.body || {})) {
      if (allowed.includes(key)) v[key] = req.body[key];
    }
    await v.save();
    res.json(v);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * DELETE /api/videos/:id
 * Only uploader can delete
 */
router.delete("/:id", authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ message: "Invalid id" });

    const v = await Video.findById(id);
    if (!v) return res.status(404).json({ message: "Not found" });
    if (String(v.uploader) !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    await v.deleteOne();
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * POST /api/videos/:id/like  (toggle)
 * Requires Video schema: likes: [ObjectId], dislikes: [ObjectId]
 */
router.post("/:id/like", authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ message: "Invalid id" });

    const v = await Video.findById(id);
    if (!v) return res.status(404).json({ message: "Not found" });

    const uid = req.user.id;
    const liked = v.likes.some(u => String(u) === uid);
    const disliked = v.dislikes.some(u => String(u) === uid);

    if (liked) {
      // toggle off like
      v.likes.pull(uid);
    } else {
      v.likes.addToSet(uid);
      if (disliked) v.dislikes.pull(uid);
    }

    await v.save();
    res.json({ likes: v.likes.length, dislikes: v.dislikes.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * POST /api/videos/:id/dislike  (toggle)
 * Requires Video schema: likes: [ObjectId], dislikes: [ObjectId]
 */
router.post("/:id/dislike", authRequired, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isId(id)) return res.status(400).json({ message: "Invalid id" });

    const v = await Video.findById(id);
    if (!v) return res.status(404).json({ message: "Not found" });

    const uid = req.user.id;
    const liked = v.likes.some(u => String(u) === uid);
    const disliked = v.dislikes.some(u => String(u) === uid);

    if (disliked) {
      // toggle off dislike
      v.dislikes.pull(uid);
    } else {
      v.dislikes.addToSet(uid);
      if (liked) v.likes.pull(uid);
    }

    await v.save();
    res.json({ likes: v.likes.length, dislikes: v.dislikes.length });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
