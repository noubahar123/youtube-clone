import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Header({ onSearch }) {
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(q);
    navigate("/");
  };

  // Ensure desktop defaults to expanded (not collapsed)
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      document.body.classList.remove("sidebar-collapsed");
    }
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      // Desktop: collapse/expand
      document.body.classList.toggle("sidebar-collapsed");
    } else {
      // Mobile/Tablet: open/close drawer
      document.body.classList.toggle("sidebar-open");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/80 backdrop-blur border-b dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
        <div className="flex items-center gap-3">
          {/* Hamburger visible on all sizes */}
          <button
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="text-2xl leading-none"
            type="button"
          >
            ☰
          </button>

          <Link to="/" className="font-extrabold text-2xl tracking-tight">
            YouTube<span className="text-red-600">Clone</span>
          </Link>
        </div>

        {/* Desktop search */}
        <form onSubmit={handleSubmit} className="hidden sm:flex items-center gap-2 flex-1">
          <div className="flex items-center gap-2 flex-1 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-red-500">
            <input
              aria-label="Search videos"
              placeholder="Search by title..."
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              className="flex-1 outline-none bg-transparent text-sm"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 text-sm">
            Search
          </button>
        </form>

        <nav className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <span className="hidden sm:block text-sm">Hi, <strong>{user.username}</strong></span>
              <Link to="/channel/create" className="px-3 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">
                Create Channel
              </Link>
              <button onClick={logout} className="px-3 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">
                Logout
              </button>
            </>
          ) : (
            <Link to="/signin" className="px-3 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">
              Sign in
            </Link>
          )}
        </nav>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden px-4 pb-3">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-800"
            placeholder="Search by title..."
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
          <button className="px-3 py-2 bg-red-600 text-white rounded-lg">Go</button>
        </form>
      </div>
    </header>
  );
}
