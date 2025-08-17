import { useEffect, useState } from "react";
import { Link, useParams, useNavigate  } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

// const navigate = useNavigate();

export default function VideoPlayer(){
  const navigate = useNavigate()
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [suggested, setSuggested] = useState([]);        // 
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const { user } = useAuth();

  const load = async ()=>{
    const v = await api.get(`/videos/${id}`);
    setVideo(v.data);


    // robust for both "arrays" or "numbers" schema
    setLikes(Array.isArray(v.data.likes) ? v.data.likes.length : (v.data.likes || 0));
    setDislikes(Array.isArray(v.data.dislikes) ? v.data.dislikes.length : (v.data.dislikes || 0));

    const c = await api.get(`/comments/${id}`);
    setComments(c.data);

    // 👇 fetch suggested videos (simple version: all others)
    const all = await api.get("/videos");
    const others = (Array.isArray(all.data) ? all.data : all.data?.videos || [])
      .filter(vv => vv._id !== id)
      .slice(0, 12); // limit
    setSuggested(others);
  };

  useEffect(()=>{ load(); }, [id]);


  // Reactions

  // ===== Reactions =====
  const handleLike = async () => {
    try {
      const res = await api.post(`/videos/${id}/like`);
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
    } catch (e) {
      if (e.response?.status === 401) navigate("/signin");
    }
  };

  const handleDislike = async () => {
    try {
      const res = await api.post(`/videos/${id}/dislike`);
      setLikes(res.data.likes);
      setDislikes(res.data.dislikes);
    } catch (e) {
      if (e.response?.status === 401) navigate("/signin");
    }
  };

  // Comments
  const addComment = async (e)=>{
    e.preventDefault();
    if(!text.trim()) return;
    await api.post(`/comments/${id}`, { text });
    setText("");
    load();
  };



  const editComment = async (commentId)=>{
    const t = prompt("Edit your comment:");
    if(t != null){
      await api.patch(`/comments/${commentId}`, { text:t });
      load();
    }
  };

  const deleteComment = async (commentId)=>{
    if(confirm("Delete comment?")){
      await api.delete(`/comments/${commentId}`);
      load();
    }
  };

  if(!video) return <div className="p-4">Loading...</div>;

    return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[2fr_1fr] gap-6">
        {/* LEFT: player + details */}
        <section>
          <video
            src={video.videoUrl}
            controls
            className="w-full rounded-2xl shadow"
            poster={video.thumbnailUrl}
          />

          {/* Title */}
          <h2 className="text-2xl font-bold mt-3">{video.title}</h2>

          {/* Channel + meta + actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
            <div className="flex items-center gap-3">
              <Link
                to={`/channel/${video.channel?._id}`}
                className="font-semibold hover:underline"
              >
                {video.channel?.channelName || "Channel"}
              </Link>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                • {video.views} views
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className="px-3 py-1.5 rounded-lg border dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                title="Like"
              >
                👍 {likes}
              </button>
              <button
                onClick={handleDislike}
                className="px-3 py-1.5 rounded-lg border dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                title="Dislike"
              >
                👎 {dislikes}
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border dark:border-gray-800 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                title="Share"
              >
                🔗 Share
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            {video.description}
          </p>

          <hr className="my-4 border-gray-200 dark:border-gray-800" />

          {/* Comments */}
          <h3 className="font-semibold">Comments</h3>
          {user ? (
            <form onSubmit={addComment} className="grid grid-cols-[1fr_auto] gap-2">
              <input
                className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-800"
                placeholder="Add a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                type="submit"
                className="px-3 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-lg"
              >
                Post
              </button>
            </form>
          ) : (
            <p className="text-sm">
              <Link to="/signin" className="text-blue-600">Sign in</Link> to comment.
            </p>
          )}

          <ul className="grid gap-3 mt-3">
            {comments.map((c) => (
              <li
                key={c._id}
                className="border rounded-xl p-3 bg-white dark:bg-gray-900 dark:border-gray-800"
              >
                <div className="flex justify-between">
                  <strong>{c.user?.username || "User"}</strong>
                  {user?.id === c.user?._id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => editComment(c._id)}
                        className="px-2 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteComment(c._id)}
                        className="px-2 py-1 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-1 text-sm">{c.text}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* RIGHT: Suggested videos */}
        <aside className="hidden lg:block">
          <div className="border rounded-2xl p-4 bg-white dark:bg-gray-900 dark:border-gray-800">
            <h3 className="font-semibold mb-2">Suggested</h3>
            <ul className="grid gap-3">
              {suggested.map((s) => (
                <li key={s._id}>
                  <Link to={`/video/${s._id}`} className="flex gap-3 group">
                    <img
                      src={s.thumbnailUrl || "https://via.placeholder.com/280x158?text=Thumbnail"}
                      alt={s.title}
                      className="w-44 h-24 object-cover rounded-md border dark:border-gray-800 shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-sm line-clamp-2 group-hover:underline">
                        {s.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {s.channel?.channelName || "Channel"} • {s.views} views
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
