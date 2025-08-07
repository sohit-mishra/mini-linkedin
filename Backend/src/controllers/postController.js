const Post = require("@/models/Post");
const User = require("@/models/User");

const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const authorID = req.user.id;
    const newPost = new Post({ authorID, content, image });
    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const currentUserId = req.user?.id || null;

    const posts = await Post.find()
      .populate("authorID", "name avatar")
      .populate("comments.user", "name avatar")
      .sort({ createdAt: -1 });

    const enrichedPosts = posts.map((post) => {
      const totalLikes = post.likes?.length || 0;
      const likedByCurrentUser = currentUserId
        ? post.likes?.some((likeUserId) => likeUserId.toString() === currentUserId)
        : false;

      const postObject = post.toObject();
      delete postObject.likes;

      return {
        ...postObject,
        totalLikes,
        likedByCurrentUser,
      };
    });

    res.status(200).json(enrichedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getUserPosts = async (req, res) => {
  try {
    const authorID = req.user.id;

    const user = await User.findById(authorID).select("name email bio avatar");
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ authorID })
      .populate("authorID", "name avatar")
      .populate("comments.user", "name avatar") 
      .sort({ createdAt: -1 });

    const enrichedPosts = posts.map((post) => {
      const totalLikes = post.likes?.length || 0;
      const likedByCurrentUser = post.likes?.some(
        (likeUserId) => likeUserId.toString() === authorID
      );

      const postObject = post.toObject();
      delete postObject.likes;

      return {
        ...postObject,
        totalLikes,
        likedByCurrentUser,
      };
    });

    res.status(200).json({ user, posts: enrichedPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id || null; 
    const post = await Post.findById(id)
      .populate("authorID", "name avatar")
      .populate("comments.user", "name avatar");

    if (!post) return res.status(404).json({ error: "Post not found" });

    const totalLikes = post.likes?.length || 0;
    const likedByCurrentUser = currentUserId
      ? post.likes?.some((likeUserId) => likeUserId.toString() === currentUserId)
      : false;

    const postObject = post.toObject();
    delete postObject.likes; 

    res.status(200).json({
      ...postObject,
      totalLikes,
      likedByCurrentUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.authorID.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);
    if (alreadyLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.status(200).json({
      message: alreadyLiked ? "Post unliked" : "Post liked",
      likes: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id || null; 

    const user = await User.findById(id).select("name email bio avatar");
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ authorID: id })
      .populate("authorID", "name avatar")
      .populate("comments.user", "name avatar")
      .sort({ createdAt: -1 });

    const enrichedPosts = posts.map((post) => {
      const totalLikes = post.likes?.length || 0;
      const likedByCurrentUser = currentUserId
        ? post.likes?.some((likeUserId) => likeUserId.toString() === currentUserId)
        : false;

      const postObject = post.toObject();
      delete postObject.likes;

      return {
        ...postObject,
        totalLikes,
        likedByCurrentUser,
      };
    });

    res.status(200).json({ user, posts: enrichedPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ error: "Comment text is required" });

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.comments.push({ user: req.user.id, text });
    await post.save();

    const updatedPost = await Post.findById(id)
      .populate("comments.user", "name avatar")
      .select("comments");

    res.status(201).json({
      message: "Comment added",
      comments: updatedPost.comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
   
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (
      comment.user.toString() !== req.user.id &&
      post.authorID.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    comment.deleteOne(); 
    await post.save();

    const updatedPost = await Post.findById(id).populate("comments.user", "name avatar");

    res.status(200).json({
      message: "Comment deleted",
      comments: updatedPost.comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getUserPosts,
  getSinglePost,
  deletePost,
  likePost,
  getUserProfile,
  createComment,
  deleteComment,
};
