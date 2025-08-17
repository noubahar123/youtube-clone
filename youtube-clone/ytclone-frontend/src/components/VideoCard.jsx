import { Link } from "react-router-dom";
import { useRef } from "react";

export default function VideoCard({ video }){
  const videoRef = useRef(null);

  const onEnter = ()=>{
    if(videoRef.current){
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if(playPromise?.catch) playPromise.catch(()=>{});
    }
  };
  const onLeave = ()=>{
    if(videoRef.current){
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link to={`/video/${video._id}`} className="group block border rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all">
      <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
        <video
          ref={videoRef}
          className="w-full aspect-video object-cover bg-gray-200 dark:bg-gray-800"
          poster={video.thumbnailUrl}
          src={video.videoUrl}
          preload="metadata"
          playsInline
          muted
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors grid place-items-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-3xl">▶</span>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-semibold line-clamp-2">{video.title}</h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{video.channel?.channelName || "Channel"} • {video.views} views</p>
      </div>
    </Link>
  );
}
