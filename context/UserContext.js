"use client"
import React, { createContext, useContext, useState } from "react";

// Create a context with default values
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User details are stored in state

  // Function to update user details
  const loginUser = (userDetails) => {
    setUser(userDetails);
  };

  // Function to clear user details (e.g., on logout)
  const logoutUser = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the context
export const useUser = () => useContext(UserContext);
