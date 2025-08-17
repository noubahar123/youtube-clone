// Bulk-upload videos to your running backend using the REST API.
// 1) npm i axios
// 2) node api-bulk-upload.js

import axios from "axios";
import fs from "fs";

const BASE = "http://localhost:5000/api";
const EMAIL = "john@example.com";      // <-- change
const PASSWORD = "password123";        // <-- change
const CHANNEL_ID = "<your_channel_id>";// <-- paste from POST /api/channels response

async function main(){
  const data = JSON.parse(fs.readFileSync(new URL('./seed.videos.100.json', import.meta.url)));
  const { data: login } = await axios.post(`${BASE}/auth/login`, { email: EMAIL, password: PASSWORD });
  const token = login.token;
  const api = axios.create({ baseURL: BASE, headers: { Authorization: `Bearer ${token}` } });

  let ok = 0; let fail = 0;
  for(const v of data){
    try{
      await api.post("/videos", { ...v, channelId: CHANNEL_ID });
      ok++;
    }catch(e){
      fail++;
      console.error("Failed:", v.title, e.response?.data || e.message);
    }
  }
  console.log("Done. OK:", ok, "Failed:", fail);
}

main().catch(console.error);
