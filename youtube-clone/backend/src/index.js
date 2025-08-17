import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videos.js";
import channelRoutes from "./routes/channels.js";
import commentRoutes from "./routes/comments.js";
import { PORT, MONGO_URI } from "./config/appConfig.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_,res)=>res.send("YouTube Clone API running"));

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/comments", commentRoutes);


connectDB(MONGO_URI).then(()=>{
  app.listen(PORT, ()=>console.log("🚀 Server on http://localhost:"+PORT));
});
