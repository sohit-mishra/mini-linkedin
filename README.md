
# 🚀 Mini LinkedIn

A LinkedIn-style full-stack application built as part of the CIAAN Cyber Tech Internship Challenge.  
It allows users to register, create posts (text & image), interact with others, and manage their profiles.

## 🌐 Live Demo

🔗 **Live URL**: https://mini-linkedin-3p4z.onrender.com
📂 **GitHub Repository**: https://github.com/sohit-mishra/mini-linkedin.git

---

## 🧰 Tech Stack

| Layer     | Technology              |
|-----------|--------------------------|
| Frontend  | React.js + Tailwind CSS |
| Backend   | Node.js + Express.js    |
| Database  | MongoDB (Mongoose)      |
| Auth      | JWT + bcrypt            |
| Hosting   | Vercel (Frontend), Render (Backend), MongoDB Atlas |
| Mail      | Nodemailer (OTP email)  |
| File Upload | Cloudinary (image hosting) |

---

## ✨ Features

### 🔐 Authentication
- ✅ Register with email, name, password
- ✅ Login
- ✅ Forgot password with OTP (sent via email)
- ✅ Reset password with token
- ✅ JWT-based session authentication

### 🧑‍💼 User Profile
- ✅ View public profile (name, bio, avatar, posts)
- ✅ Edit profile (name, bio, avatar)
- ✅ See other user’s profile

### 📝 Post Feed
- ✅ Create post (text or image)
- ✅ View all public posts in Home feed
- ✅ Post includes author name, avatar, and timestamp
- ✅ Like / Unlike post
- ✅ Add comment / Delete own comment
- ✅ Share post (copy link)
- ✅ Delete own post

### 📄 Profile Page
- ✅ View own posts
- ✅ View posts made by other users
- ✅ Edit/delete own content only

---


## 🛠️ Setup Instructions

### ⚙️ Backend + Frontend 

```bash
git clone https://github.com/sohit-mishra/mini-linkedin.git
cd mini-linkedin
npm install
cd Backend
npm install
```

## ✅ Step 1: Enable 2-Step Verification

1. Visit your Google Account security settings:\
   [https://myaccount.google.com/security](https://myaccount.google.com/security)

2. Scroll down to **"Signing in to Google"**.

3. Enable **2-Step Verification**.

---

## ✅ Step 2: Generate an App Password

1. After enabling 2FA, go to the **App Passwords** page:\
   [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

2. Choose the following:

   - **App**: Mail
   - **Device**: Other (Custom name) → e.g., `Nodemailer`

3. Click **Generate** and copy the 16-character password.

> ⚠️ This password will not be shown again. Store it securely.

---

Create `.env` file:

```env
PORT=5000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password above guve isntstuction
FRONTEND_URL=http://localhost:5173
APP_NAME = Linkdlin
EMAIL_SERVICE=gmail
```

### 💻 Frontend

```bash
cd ..
cd Frontend
npm install 
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000.com
```

Start dev server:

```bash
cd ..
npm run dev
```

---

---

## 📸 Media Upload

- Cloudinary is used to store user avatars and post images.
- Image previews and fallback avatar provided.

---

## 🧠 Extras (Optional)

- ⏱️ Human-readable timestamps (e.g., "2 hours ago")
- 🔐 Protected routes using JWT
- 🔎 404 Page & private route redirects
- 📱 Mobile responsive

---

## 📧 Submission

- GitHub: https://github.com/sohit-mishra/mini-linkedin.git
- Live: https://mini-linkedin-3p4z.onrender.com

