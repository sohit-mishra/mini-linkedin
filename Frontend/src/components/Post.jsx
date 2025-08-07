import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import api from "@/utils/api";
import { showError, showSuccess } from "@/utils/toast";
import { Trash, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Post({ post, onDelete }) {
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext);
  const [totalLikes, setTotalLikes] = useState(post.totalLikes || 0);
  const [checkLikes, setCheckLikes] = useState(
    post.likedByCurrentUser || false
  );
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      const res = await api.put(`/api/posts/${post._id}/like`);
      setTotalLikes(res.data.likes || 0);
      setCheckLikes(!checkLikes);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to like post");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const res = await api.post(`/api/posts/${post._id}/comment`, {
        text: newComment,
      });
      setComments(res.data.comments || []);
      setNewComment("");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await api.delete(
        `/api/posts/${post._id}/comment/${commentId}`
      );
      setComments(res.data.comments || []);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const handleDeletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await api.delete(`/api/posts/${post._id}`);
      showSuccess("Post deleted");
      if (onDelete) onDelete(post._id);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete post");
    }
  };

  const formatNumber = (num) => {
    if (typeof num !== "number" || isNaN(num)) return "0";
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return num.toString();
  };

  const handleShare = (post) => {
    const shareData = {
      url: window.location.origin + "/post/" + post._id,
    };

    if (navigator.share) {
      navigator.share(shareData).catch((err) => {
        showError("Sharing failed: " + err.message);
      });
    } else {
      navigator.clipboard.writeText(shareData.url).then(() => {
        showSuccess("Link copied to clipboard!");
      });
    }
  };

   const handlePublicPage = (id) => {
    navigate(`/user/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border rounded-lg p-4 bg-gray-50"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3" onClick={()=> handlePublicPage(post.authorID._id)}>
          <img
            src={post.authorID?.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-gray-800 font-medium">
              {post.authorID?.name || "Unknown"}
            </p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>

        {userId === post.authorID._id && (
          <button
            onClick={handleDeletePost}
            className="text-red-500 hover:text-red-700"
          >
            <Trash size={16} />
          </button>
        )}
      </div>

      <hr className="mt-1 mb-2 border-gray-200" />

      {post.content && <p className="text-gray-800 my-2">{post.content}</p>}

      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full h-[500px] object-cover rounded-lg mb-3"
        />
      )}

      <hr className="mt-1 mb-2 border-gray-200" />

      <div className="flex items-center justify-between mt-3 text-sm text-gray-600">
        <button
          className={`flex items-center gap-1 text-sm ${
            checkLikes ? "text-blue-600" : "text-gray-600"
          } hover:text-black-600`}
          onClick={handleLike}
        >
          <ThumbsUp size={16} />
          {formatNumber(totalLikes)} Likes
        </button>

        <button
          className="flex items-center gap-1 hover:text-blue-600"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={16} />
          {comments.length} Comments
        </button>

        <button
          className="flex items-center gap-1 hover:text-blue-600"
          onClick={() => handleShare(post)}
        >
          <Share2 size={16} />
          Share
        </button>
      </div>

      {showComments && (
        <>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded px-3 py-1 text-sm"
            />
            <button
              onClick={handleAddComment}
              disabled={loading || !newComment.trim()}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-white rounded shadow p-2 flex justify-between items-start text-sm"
              >
                <div className="mb-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={comment.user?.avatar || "/default-avatar.png"}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {comment.user?.name || "Anonymous"}
                        <span className="ml-2 text-xs font-normal text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </p>

                      <p className="text-sm text-gray-700 mt-1">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                </div>

                {userId === comment.user._id && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-red-500 text-xs ml-2"
                  >
                    <Trash size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
