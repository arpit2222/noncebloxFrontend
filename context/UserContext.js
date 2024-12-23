"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context with default values
const UserContext = createContext(null);

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On initial render, check if user details exist in local storage
  useEffect(() => {
    if (typeof window !== "undefined") { // Ensure this code runs on the client
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // Function to update user details
  const loginUser = (userDetails) => {
    setUser(userDetails);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userDetails));
    }
  };

  // Function to clear user details (e.g., on logout)
  const logoutUser = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
