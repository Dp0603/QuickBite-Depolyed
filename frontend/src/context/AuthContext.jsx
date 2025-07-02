import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  async function login(email, pwd) {
    const { data } = await axios.post("/auth/login", { email, password: pwd });
    setUser(data);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
