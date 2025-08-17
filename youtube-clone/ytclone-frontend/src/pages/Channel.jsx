import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import VideoGrid from "../components/VideoGrid";
import { useAuth } from "../context/AuthContext";

export default function ChannelPage(){
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const { user } = useAuth();

  const load = async ()=>{
    const ch = await api.get(`/channels/${id}`);
    setChannel(ch.data);
    const vs = await api.get(`/channels/${id}/videos`);
    setVideos(vs.data);
  };

  useEffect(()=>{ load(); }, [id]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        {!channel ? "Loading..." : (
          <>
            <div className="border p-5 rounded-2xl mb-5 bg-white dark:bg-gray-900 dark:border-gray-800">
              <h2 className="text-2xl font-bold">{channel.channelName}</h2>
              <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">{channel.description}</p>
            </div>
            {user?.id === channel.owner?._id && <UploadVideo channelId={channel._id} onUploaded={load} />}
            <h3 className="font-semibold mb-3">Videos</h3>
            <VideoGrid videos={videos}/>
          </>
        )}
      </div>
    </div>
  );
}

function UploadVideo({ channelId, onUploaded }){
  const [title,setTitle]=useState("");
  const [description,setDescription]=useState("");
  const [videoUrl,setVideoUrl]=useState("");
  const [thumb,setThumb]=useState("");
  const [category,setCategory]=useState("Education");

  const submit = async (e)=>{
    e.preventDefault();
    await api.post("/videos", { title, description, videoUrl, thumbnailUrl:thumb, channelId, category });
    setTitle(""); setDescription(""); setVideoUrl(""); setThumb("");
    onUploaded();
  };

  return (
    <div className="border p-5 rounded-2xl mb-6 bg-white dark:bg-gray-900 dark:border-gray-800">
      <h4 className="font-semibold mb-3">Upload / Add Video (metadata only)</h4>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3">
        <input className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-800" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required/>
        <input className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-800" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
        <input className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-800" placeholder="Video URL (mp4)" value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} required/>
        <input className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-800" placeholder="Thumbnail URL" value={thumb} onChange={e=>setThumb(e.target.value)} />
        <select className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-800" value={category} onChange={e=>setCategory(e.target.value)}>
          {["Education","Music","Sports","Gaming","News","Comedy","Tech","Travel","Science","All"].map(c=>(<option key={c}>{c}</option>))}
        </select>
        <div className="sm:col-span-2">
          <button type="submit" className="px-4 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-lg">Save</button>
        </div>
      </form>
    </div>
  );
}
