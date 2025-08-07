import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { showSuccess, showError } from "@/utils/toast";
import api from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    content: "",
    imageUrl: null,
    imagePreview: null,
  });
  const [btn, setBtn] = useState(false);

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, content: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({
      ...formData,
      imagePreview: URL.createObjectURL(file),
    });

    try {
      const data = new FormData();
      data.append("image", file);
      setBtn(true);

      const res = await api.post("/api/upload/post", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({
        ...prev,
        imageUrl: res.data.url,
      }));

      showSuccess(res.data.message || "Image uploaded successfully!");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to upload image");
      setFormData((prev) => ({ ...prev, imageUrl: null, imagePreview: null }));
    }finally{
      setBtn(false)
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, imageUrl: null, imagePreview: null });
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim() && !formData.imageUrl) {
      return showError("Post cannot be empty!");
    }

    try {
      setLoading(true);

      const res = await api.post("/api/posts", {
        content: formData.content,
        image: formData.imageUrl,
      });

      showSuccess(res.data.message || "Post created successfully!");
      setFormData({ content: "", imageUrl: null, imagePreview: null });
      if (fileInputRef.current) fileInputRef.current.value = null;
      setTimeout(() => {
        navigate(`/profile`);
      }, 1000);
    } catch (err) {
      showError(err.response?.data?.error || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto bg-white shadow-md rounded-2xl p-6 mt-6"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Create a Post
      </h3>
      <p className="text-sm text-gray-500 mb-4">Share your thoughts</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg text-sm focus:ring focus:ring-blue-200 resize-none"
          rows="4"
          placeholder="What's on your mind?"
        />

        <div className="relative">
          {formData.imagePreview ? (
            <div className="relative">
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 bg-black bg-opacity-60 text-white p-1 rounded-full hover:bg-opacity-80"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleImageClick}
              className="w-full h-50 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition"
            >
              <ImageIcon size={32} className="text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">
                Click to upload an image
              </span>
            </button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={btn}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow disabled:opacity-60"
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
