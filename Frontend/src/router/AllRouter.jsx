import React from "react"
import { Routes, Route } from "react-router-dom"

import Login from "@/pages/Login"
import Signup from "@/pages/Signup"
import ForgetPassword from "@/pages/ForgetPassword"
import ConfirmPassword from "@/pages/ConfirmPassword"
import Otp from "@/pages/Otp"

import PrivateLayout from "@/Layout/PrivateLayout"

import Home from '@/pages/Home'
import Profile from "@/pages/Profile"
import CreatePost from "@/pages/CreatePost"
import PublicProfile from "@/pages/PublicProfile"
import PageNotFound from "@/pages/PageNotFound"
import AdminProfile from "@/pages/AdminProfile"
import SinglePost from '@/pages/SinglePost'

export default function AllRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/confirm-password/:token" element={<ConfirmPassword />} />
      <Route path="/otp" element={<Otp />} />

      <Route element={<PrivateLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/setting/profile" element={<Profile />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/create-post" element={<CreatePost />} />
         <Route path="/postId/:id" element={<SinglePost />} />
        <Route path="/user/:id" element={<PublicProfile />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>

  )
}
