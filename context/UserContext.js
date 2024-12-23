"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context with default values
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User details are stored in state

  // On initial render, check if user details exist in local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse and set the user state
    }
  }, []);

  // Function to update user details
  const loginUser = (userDetails) => {
    setUser(userDetails);
    localStorage.setItem("user", JSON.stringify(userDetails)); // Save user to local storage
  };

  // Function to clear user details (e.g., on logout)
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove user from local storage
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

  // If the user is not in the context, check local storage
  if (!context.user) {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      context.user = JSON.parse(storedUser); // Update context with the user from local storage
    }
  }

  return context;
};
