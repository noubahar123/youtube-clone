import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token){
      try{
        const decoded = jwtDecode(token);
        setUser({ id: decoded.id, username: decoded.username });
      }catch{}
    }
  }, []);

  const login = (token)=>{
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser({ id: decoded.id, username: decoded.username });
  };

  const logout = ()=>{
    localStorage.removeItem("token");
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = ()=> useContext(AuthContext);
