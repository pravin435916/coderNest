import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaCopy, FaShareAlt,FaWhatsapp } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const ShareButton = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false);
  const shareUrl = `https://localhost:5173/posts/${post?._id}`; // Replace with your actual post link format

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => toast.success("Link copied to clipboard!"))
      .catch(() => toast.error("Failed to copy link."));
  };

  return (
    <div className="relative inline-block">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Main Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 bg-blue-300 text-white rounded-full transition-colors"
      >
        <FaShareAlt size={20} />
      </button>

      {/* Share Options */}
      {isOpen && (
        <div className="absolute top-12 left-0 flex space-x-4 bg-white p-4 rounded shadow-lg">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            <FaFacebook size={20} />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl
            )}&text=Check out this post!`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
          >
            <FaTwitter size={20} />
          </a>
          <button
            onClick={handleCopyLink}
            className="p-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors"
          >
            <FaCopy size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
