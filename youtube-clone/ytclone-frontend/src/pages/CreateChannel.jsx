import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateChannel(){
  const [channelName,setChannelName]=useState("");
  const [description,setDescription]=useState("");
  const [channelBanner,setChannelBanner]=useState("");
  const navigate = useNavigate();

  const submit = async (e)=>{
    e.preventDefault();
    const res = await api.post("/channels", { channelName, description, channelBanner });
    navigate(`/channel/${res.data._id}`);
  };

  return (
    <div className="grid place-items-center p-6">
      <div className="w-full max-w-lg border rounded-xl p-6 bg-white dark:bg-gray-900 dark:border-gray-800">
        <h2 className="text-xl font-bold mb-3">Create Channel</h2>
        <form onSubmit={submit} className="grid gap-3">
          <input className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-800" placeholder="Channel name" value={channelName} onChange={e=>setChannelName(e.target.value)} required />
          <textarea className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-800" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <input className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-800" placeholder="Banner image URL" value={channelBanner} onChange={e=>setChannelBanner(e.target.value)} />
          <button type="submit" className="px-3 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-lg">Create</button>
        </form>
      </div>
    </div>
  );
}
