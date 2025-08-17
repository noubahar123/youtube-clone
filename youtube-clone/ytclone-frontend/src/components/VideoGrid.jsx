import VideoCard from "./VideoCard";

export default function VideoGrid({ videos }){
  if (!videos?.length) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">No videos found for this filter/search.</div>;
  }
  return (
    <div className="grid gap-5 sm:gap-6 md:gap-7 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
      {videos.map(v=> <VideoCard key={v._id} video={v} />)}
    </div>
  );
}
