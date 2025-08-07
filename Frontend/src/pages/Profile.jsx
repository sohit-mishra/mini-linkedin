import React, { useState, useEffect, useRef } from "react";
import avatarPlaceholder from "@/assets/avatar.svg";
import { motion } from "framer-motion";
import { showSuccess, showError } from "@/utils/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/utils/api";

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
    avatarPreview: avatarPlaceholder,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setFormData((prev) => ({
          ...prev,
          name: res.data.name,
          email: res.data.email,
          bio: res.data.bio || "",
          avatar: res.data.avatar || "",
          avatarPreview: res.data.avatar || avatarPlaceholder,
        }));
      } catch (err) {
        showError("Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, avatarPreview: localPreview }));

    try {
      const data = new FormData();
      data.append("avatar", file);

      const res = await api.post("/api/upload/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData((prev) => ({
        ...prev,
        avatar: res.data.url,
        avatarPreview: res.data.url,
      }));

      showSuccess(res.data.message || "Avatar uploaded successfully!");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to upload avatar");
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        avatar: formData.avatar,
      };

      const res = await api.put("/api/auth/update", data);

      showSuccess(res.data.message || "Profile updated successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      showError(err.response?.data?.error || "Failed to update profile");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto bg-white shadow rounded-lg p-6 mt-6"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Edit Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          <div
            className="relative cursor-pointer group"
            onClick={handleAvatarClick}
          >
            <img
              src={formData.avatarPreview}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover border group-hover:opacity-80 transition"
            />
            <span className="absolute bottom-0 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-full opacity-80 group-hover:opacity-100">
              Change
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full p-2 border rounded text-sm"
            rows="4"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-blue-600 text-white">
            Save Changes
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
