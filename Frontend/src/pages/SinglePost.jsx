import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '@/utils/api';
import { showError } from '@/utils/toast';
import Post from '@/components/Post';

export default function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/api/posts/${id}`);
        setPost(res.data);
        setUser(res.data); 
      } catch (err) {
        showError(err.response?.data?.error || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!post) return <p className="text-center mt-8 text-red-500">Post not vvfound</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto mt-6"
    >
      <Post key={post._id} post={post} />
    </motion.div>
  );
}
