import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar(){
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sync = () => setOpen(document.body.classList.contains("sidebar-open"));
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        document.body.classList.remove("sidebar-open");
      }
      sync();
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        document.body.classList.remove("sidebar-open");
        sync();
      }
    };
    sync();
    window.addEventListener("click", sync);
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("click", sync);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // Lock body scroll while drawer open
  useEffect(() => {
    if (open) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
  }, [open]);

  const NavItem = ({ icon, label, to = "#" }) => (
    <Link
      to={to}
      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <span className="text-lg">{icon}</span>
      <span className="sidebar-label">{label}</span>
    </Link>
  );

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={() => document.body.classList.remove("sidebar-open")}
        className={`fixed inset-0 bg-black/40 z-30 lg:hidden ${open ? "block" : "hidden"}`}
      />

      {/* Drawer (mobile) / Fixed (desktop) */}
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`
          sidebar-fixed
          fixed z-40 top-[64px] bottom-0 border-r
          bg-white dark:bg-gray-900 dark:border-gray-800
          transition-transform
          left-0
          -translate-x-full lg:translate-x-0
          ${open ? "translate-x-0" : ""}
          w-64
        `}
        aria-label="Sidebar"
      >
        <h3 className="px-4 py-3 font-semibold sidebar-label">You</h3>
        <div className="grid gap-1 px-2 pb-2">
          <NavItem icon="🏠" label="Home" to="/" />
          <NavItem icon="🎬" label="Shorts" />
          <NavItem icon="📺" label="Subscriptions" />
          <div className="my-2 border-t dark:border-gray-800" />
          <NavItem icon="🕘" label="History" />
          <NavItem icon="🎵" label="Playlists" />
          <NavItem icon="📹" label="Your videos" />
          <NavItem icon="⏱️" label="Watch later" />
          <NavItem icon="👍" label="Liked videos" />
        </div>
        <div className="px-4 pt-2 text-xs text-gray-500 dark:text-gray-400 sidebar-label">
          Use the category chips at the top to filter videos.
        </div>
      </aside>
    </>
  );
}
