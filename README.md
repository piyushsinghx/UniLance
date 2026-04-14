# 🚀 UniLance — Freelance Marketplace for Students

**UniLance** is a full-stack web application that connects university students with freelance opportunities.
It allows students to showcase their skills, create gigs, and earn money while studying, while clients can hire talented students for various services.

---

## 🎯 Project Objective

To build a modern freelance platform exclusively for **college students**, enabling them to:

* 💼 Earn while learning
* 🧑‍💻 Showcase their skills
* 🤝 Collaborate on real-world projects

---

## 🧩 Features

### 🔐 Authentication & Authorization

* User Signup/Login (JWT-based)
* Role-based access (Buyer / Seller)
* College email verification (unique feature)

---

### 🏠 Landing Page

* Modern SaaS-style UI
* Search bar for gigs
* Categories (Web Dev, Design, Writing, etc.)
* Featured freelancers

---

### 🛍️ Gig Marketplace

* Create, update, delete gigs
* Browse gigs with filters (price, rating, category)
* Gig cards with pricing and ratings

---

### 📄 Gig Details

* Detailed description
* Pricing tiers (Basic / Standard / Premium)
* Seller profile
* Reviews & ratings

---

### 📊 Dashboard

* User analytics (earnings, orders, ratings)
* Manage gigs
* Manage orders
* Activity overview

---

### 💬 Real-Time Chat

* Instant messaging using Socket.io
* Conversation list
* Message timestamps

---

### 📦 Order Management

* Place orders
* Track order status (Pending / Active / Completed)
* Mark orders as completed

---

### 👤 Profile System

* User profile with skills & portfolio
* Ratings and reviews
* Edit profile functionality

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Real-Time

* Socket.io

### Authentication

* JSON Web Tokens (JWT)

---

## 📁 Folder Structure

```
unilance/
├── client/      # React frontend
├── server/      # Node.js backend
├── README.md
└── .env
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/unilance.git
cd unilance
```

### 2️⃣ Setup Backend

```
cd server
npm install
npm run dev
```

### 3️⃣ Setup Frontend

```
cd client
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the `server` folder:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 🌐 Future Enhancements

* 💳 Payment integration (Razorpay/Stripe)
* 🔔 Notifications system
* 📁 File uploads (portfolio & gig images)
* 🤖 AI-based gig recommendations
* 🌍 Deployment (AWS / Vercel / Render)

---

## 💡 Unique Selling Point (USP)

UniLance is designed **only for students**, ensuring:

* Verified college users
* Trusted collaboration
* Skill-building + earning platform

---

## 📸 Screenshots

(Add your UI screenshots here)

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repo and submit a pull request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Piyush Singh**
BTech CSE Student | Full Stack Developer

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
