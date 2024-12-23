"use client";

import React, { useState, useEffect } from "react";
import Post from "./Post";
import axios from "axios";

// Main Feed Component
const MainFeed = () => {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch posts data from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts`
        );
        if (response.status === 200) {
          setPosts(response.data);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleNewPostSubmit = async () => {
    if (newPostTitle.trim() && newPostContent.trim()) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.token) {
        alert("You must be logged in to create a post.");
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts`,
          {
            title: newPostTitle,
            content: newPostContent,
            author: user.id,
            authorName: user.username,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (response.status === 201) {
          const newPost = response.data;
          setPosts((prevPosts) => [newPost, ...prevPosts]); // Add the new post to the top of the list
          setNewPostTitle("");
          setNewPostContent("");
          setIsModalOpen(false); // Close modal after submitting
        } else {
          alert("Failed to create post. Please try again.");
        }
      } catch (error) {
        console.error("Error creating post:", error);
        alert("An error occurred while creating the post.");
      }
    } else {
      alert("Both title and content are required.");
    }
  };

  return (
    <div className="main-feed p-4 bg-gray-200 w-[80%]">
      {/* Create New Post Button */}
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Create New Post
        </button>
      </div>

      {/* Modal for creating a new post */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
            <input
              type="text"
              placeholder="Enter post title"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            />
            <textarea
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="border p-2 w-full mb-4 rounded-lg"
            ></textarea>
            <div className="flex justify-end">
              <button
                onClick={handleNewPostSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                Post
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
{/* Posts */}
<div className="w-[600px] mx-auto">
  {loading ? (
    <p>Loading posts...</p>
  ) : (
    posts.map((post,index) => (
      <div key={index}> {/* Apply key directly to the wrapping div */}
        <Post
          post={post}
        />
      </div>
    ))
  )}
</div>

    </div>
  );
};

export default MainFeed;