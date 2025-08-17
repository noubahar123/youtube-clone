import mongoose from "mongoose";


const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoUrl: { type: String, required: true },
  thumbnailUrl: String,
  channel: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, default: "All" },
  views: { type: Number, default: 0 },

  // instead of counts, keep arrays of users
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  uploadDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Video", videoSchema);


