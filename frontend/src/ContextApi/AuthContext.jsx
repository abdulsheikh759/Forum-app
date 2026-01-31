import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //  page refresh pe user check
  const checkAuth = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);


  
const login = async (email, password) => {

  await api.post("/users/login", { email, password });

  const res = await api.get("/users/me");

  setUser(res.data.user);

  return res.data.user;
};


  //  signup
  const signup = async (data) => {
    await api.post("/users/register", data);
  };

  //  logout
  const logout = async () => {
  await api.post("/users/logout");
  setUser(null);
};

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
