"use client";

import React, { useState } from "react";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { LiaCommentSolid } from "react-icons/lia";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { useFormik } from "formik";

// Post component for individual post display
const Post = ({ post }) => {
  const { user } = useUser();
  const [isCommentsOpen, setIsCommentsOpen] = useState(false); // State to manage comments visibility

  // Formik for handling comment input
  const formik = useFormik({
    initialValues: { commentText: "" },
    onSubmit: async (values, { resetForm }) => {
      if (values.commentText) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${post._id}/comment`,
            { text: values.commentText,
            userId: user?.id,
            username: user?.username
             },
            {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            }
          );
  
          if (response.status === 200) {
            console.log("Comment added successfully.");
            resetForm(); // Clear the comment input field after successful submission
          } else {
            console.error("Failed to add comment.");
          }
        } catch (error) {
          console.error("Error posting comment:", error);
        }
      }
    },
  });

  // Handle like API call
  const handleLike = async (postId) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/like`,
        { userId: user?.id },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Likes updated successfully.");
      } else {
        console.error("Failed to update likes.");
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  // Handle delete comment API call
  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log("Comment deleted successfully.");
      } else {
        console.error("Failed to delete comment.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div key={post.id} className="bg-white rounded-lg shadow-lg mb-4">
      <div className="p-2 border-b bg-gray-300 flex">
        <div className="w-10 h-10 p-auto bg-gray-800 rounded-full text-white justify-start">
          <p className="text-center mt-2">{post.authorName[0]}</p>
        </div>
        <p className="font-semibold ml-4 mt-2">{post.authorName}</p>
      </div>

      <div className="p-4 border-b">
        <h3 className="font-semibold">{post.title}</h3>
        <p className="mt-2 text-center"> {post.content}</p>
      </div>

      <div className="bg-gray-100">
        <div className="flex justify-between items-center p-4">
          <div>
            <button
              onClick={() => handleLike(post?._id)}
              className="text-blue-500 hover:text-blue-700 flex"
            >
              {post.likes.length}{" "}
              <p className="my-auto ml-2">
                {post.likes.includes("John Doe") ? <FcLike /> : <FcLikePlaceholder />}
              </p>
            </button>
          </div>

          <div>
            <button
              onClick={() => setIsCommentsOpen(!isCommentsOpen)} // Toggle comments visibility
              className="text-blue-500 hover:text-blue-700 flex"
            >
              {post.comments.length}{" "}
              <p className="my-auto ml-2">
                <LiaCommentSolid />
              </p>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {isCommentsOpen && (
          <div className="border-t p-4">
            <h4 className="font-semibold mt-3">Comments:</h4>
            {post.comments.map((comment,index) => (
              <div key={index} className="flex justify-between items-center mt-2">
                <div className="flex">
                  <p className="w-8 h-8 bg-gray-200 rounded-full text-center pt-[4px]">{comment.username[0]}</p>
                  <div className="pl-4">
                    <p className="text-sm text-gray-500">{comment.username}</p>
                    <p>{comment.text}</p>
                  </div>
                </div>

                {/* Show delete button only if the current user is the one who posted the comment */}
                {comment.username === user?.username && (
                  <button
                    onClick={() => handleDeleteComment(post._id, comment._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}

            {/* Comment Input Form */}
            <form onSubmit={formik.handleSubmit} className="flex mt-3">
              <input
                type="text"
                placeholder="Add a comment..."
                {...formik.getFieldProps("commentText")}
                className="border rounded-lg p-1 mr-2 w-full"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-lg px-4 py-2"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;
