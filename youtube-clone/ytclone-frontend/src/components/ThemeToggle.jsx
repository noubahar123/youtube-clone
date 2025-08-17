import useTheme from "../hooks/useTheme";

export default function ThemeToggle(){
  const { dark, toggle } = useTheme();
  return (
    <button onClick={toggle} className="px-3 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm" title="Toggle theme">
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
