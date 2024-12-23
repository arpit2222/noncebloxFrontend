"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Import the useRouter hook
import Sidebar from "@/app/component/Sidebar";
import MainFeed from "@/app/component/MainFeed";
import { useUser } from "@/context/UserContext";
const ProfilePage = () => {
  const { user } = useUser();
  const router = useRouter(); // Initialize the router

  // Redirect to the login page if the user is not logged in
  useEffect(() => {
    if (!user) {
      router.push("/"); // Redirect to the login page
    }
  }, [user, router]);
  
  const logoutUser = () => {
    setUser(null);
  };

  if (!user) {
    // Optionally, you can render a loading state while the redirect is in progress
    return <div>Redirecting...</div>;
  }

  return (
    <div className="profile-page flex">
      <Sidebar user={user} logoutUser={logoutUser} />
      <MainFeed
        user={user}
      />
    </div>
  );
};

export default ProfilePage;
