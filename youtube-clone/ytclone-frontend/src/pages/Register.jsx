import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register(){
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      await api.post("/auth/register", { username, email, password });
      navigate("/signin");
    }catch(e){ setError(e.response?.data?.message || e.message); }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Create account</h2>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <input className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-800" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
          <input className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-800" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
          <input className="px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-800" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg">Register</button>
        </form>
      </div>
    </div>
  );
}
