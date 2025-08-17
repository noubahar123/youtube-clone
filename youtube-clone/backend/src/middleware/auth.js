import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/appConfig.js";

export function authRequired(req, res, next){
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if(!token) return res.status(401).json({message: "No token"});
  try{
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username }
    next();
  }catch(e){
    return res.status(401).json({message: "Invalid token"});
  }
}
