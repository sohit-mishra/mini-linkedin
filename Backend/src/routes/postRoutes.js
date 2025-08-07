const express = require("express");
const {
  createPost,
  getAllPosts,
  getUserPosts,
  getSinglePost,
  deletePost,
  likePost,
  getUserProfile,
  createComment,
  deleteComment,
} = require("@/controllers/postController");
const authMiddleware = require("@/middleware/authMiddleware");

const router = express.Router();

router.get("/",authMiddleware, getAllPosts);
router.post("/", authMiddleware, createPost);
router.get("/user/me", authMiddleware, getUserPosts);
router.get("/user/:id", authMiddleware, getUserProfile);
router.put("/:id/like", authMiddleware, likePost);
router.post("/:id/comment", authMiddleware, createComment);
router.delete("/:id/comment/:commentId", authMiddleware, deleteComment);
router.get("/:id",authMiddleware, getSinglePost);
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
