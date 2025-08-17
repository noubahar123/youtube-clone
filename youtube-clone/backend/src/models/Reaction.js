import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  video: { type: mongoose.Schema.Types.ObjectId, ref: "Video", required: true },
  // +1 = like, -1 = dislike
  value: { type: Number, enum: [1, -1], required: true },
}, { timestamps: true });

reactionSchema.index({ user: 1, video: 1 }, { unique: true });

export default mongoose.model("Reaction", reactionSchema);
