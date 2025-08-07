import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/utils/api';
import { showError } from '@/utils/toast';
import Post from '@/components/Post';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

   const handleDelete = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get(`/api/posts`);
        setPosts(res.data || []);
      } catch (err) {
        showError(err.response?.data?.error || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-4 space-y-4"
    >
      <h1 className="text-xl font-bold mb-4">Recent Posts</h1>

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        posts.map((post) => (
          <Post key={post._id} post={post}  onDelete={handleDelete} />
        ))
      )}
    </motion.div>
  );
}
