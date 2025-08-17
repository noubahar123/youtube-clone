import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import VideoGrid from "../components/VideoGrid";

const chips = ["All","Education","Music","Sports","Gaming","News","Comedy","Tech","Travel","Science"];

// const banners = {
//   All: "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=1400&auto=format&fit=crop",
//   Education: "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1400&auto=format&fit=crop",
//   Music: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1400&auto=format&fit=crop",
//   Sports: "https://images.unsplash.com/photo-1521417532282-7a53a1e96b42?q=80&w=1400&auto=format&fit=crop",
//   Gaming: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1400&auto=format&fit=crop",
//   News: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1400&auto=format&fit=crop",
//   Comedy: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1400&auto=format&fit=crop",
//   Tech: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop",
//   Travel: "https://images.unsplash.com/photo-1511735643442-503bb3bd3482?q=80&w=1400&auto=format&fit=crop",
//   Science: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1400&auto=format&fit=crop"
// };

export default function Home({ search }) {
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [err,   setErr] = useState("");

  useEffect(() => {
    const q = new URLSearchParams();
    if (search) q.append("q", search);
    if (category && category !== "All") q.append("category", category);

    setLoading(true); setErr("");
    api.get(`/videos?${q.toString()}`)
      .then((res) => setVideos(Array.isArray(res.data) ? res.data : res.data?.videos || []))
      .catch((e) => setErr(e?.message || "Failed to load videos"))
      .finally(() => setLoading(false));
  }, [search, category]);

  // const bannerUrl = useMemo(() => banners[category] || banners["All"], [category]);

  return (
    <div className="relative overflow-x-hidden lg:pl-64">
      <Sidebar />

      <main className="px-4 sm:px-6 lg:px-8 py-4 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Top chips bar */}
          <div className="no-scrollbar overflow-x-auto -mx-1 pb-3">
            <div className="flex gap-2 min-w-max px-1">
              {chips.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-1.5 rounded-full border text-sm transition-all
                    ${
                      category === c
                        ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow border-gray-900 dark:border-white"
                        : "bg-white dark:bg-gray-900 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Category banner — remove this block if you don't want banners */}
          {/* <div className="relative rounded-2xl overflow-hidden mb-6">
            <img
              src={bannerUrl}
              alt={`${category} banner`}
              className="w-full h-48 sm:h-56 md:h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white drop-shadow">
              <h2 className="text-2xl font-bold">{category}</h2>
              <p className="text-xs opacity-90">Curated videos for {category.toLowerCase()}.</p>
            </div>
          </div> */}

          {/* Grid */}
          {loading && <div className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">Loading videos…</div>}
          {err && <div className="py-10 text-center text-sm text-red-600">{err}</div>}
          {!loading && !err && <VideoGrid videos={videos} />}
        </div>
      </main>
    </div>
  );
}
