import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  channelName: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: String,
  channelBanner: String,
  subscribers: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Channel", channelSchema);
