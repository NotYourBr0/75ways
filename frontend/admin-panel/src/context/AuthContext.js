import React, { createContext, useState, useEffect } from "react";

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // Stores user object (email etc.)
  const [isAdmin, setIsAdmin] = useState(false); // Admin access flag

  useEffect(() => {
    // Try to load user from localStorage on page reload
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
      if (
        storedUser.email === "ks@gmail.com" 
      ) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (
      userData.email === "ks@gmail.com" 
    ) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
