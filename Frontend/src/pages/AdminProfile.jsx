import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/utils/api';
import { showError } from '@/utils/toast';
import Post from '@/components/Post';

export default function AdminProfile() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/posts/user/me');
        setUser(res.data.user);
        setPosts(res.data.posts);
      } catch (err) {
        showError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleDelete = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600">No profile found</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6 mt-6"
    >
      <div className="flex items-center gap-6 border-b pb-6 mb-6">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-700 mt-2">{user.bio || 'No bio yet.'}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">My Posts</h3>

      {posts.length === 0 ? (
        <p className="text-gray-600">You haven't posted anything yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Post key={post._id} post={post} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
