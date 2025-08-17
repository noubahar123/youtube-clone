import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token);
      navigate("/");
    }catch(e){ setError(e.response?.data?.message || e.message); }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold">Sign in</h2>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 mb-4">You can also use the Google Form link below if needed.</p>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <input className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-800" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-800" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg">Sign in</button>
        </form>
        <p className="mt-3 text-sm">New here? <Link to="/register" className="text-blue-600">Create account</Link></p>
        <p className="mt-1 text-sm"><a href="https://forms.gle/placeholder" target="_blank" className="text-blue-600">Open Google Form version</a></p>
      </div>
    </div>
  );
}
