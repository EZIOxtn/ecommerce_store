# 🛒 Full-Stack E-Commerce Platform





<p align="center">

  <!-- Repository Views -->
  <a href="https://hits.dwyl.com/EZIOxtn/InstaBooster">
    <img src="https://hits.dwyl.com/EZIOxtn/InstaBooster.svg?style=flat-square" alt="Repo Views"/>
  </a>

  <!-- Stars -->
  <a href="https://github.com/EZIOxtn/InstaBooster/stargazers">
    <img src="https://img.shields.io/github/stars/EZIOxtn/InstaBooster?style=flat-square&color=yellow" alt="Stars"/>
  </a>

  <!-- Forks -->
  <a href="https://github.com/EZIOxtn/InstaBooster/network/members">
    <img src="https://img.shields.io/github/forks/EZIOxtn/InstaBooster?style=flat-square&color=orange" alt="Forks"/>
  </a>

  <!-- Issues -->
  <a href="https://github.com/EZIOxtn/InstaBooster/issues">
    <img src="https://img.shields.io/github/issues/EZIOxtn/InstaBooster?style=flat-square&color=blue" alt="Issues"/>
  </a>

  <!-- License -->
  <a href="https://github.com/EZIOxtn/InstaBooster/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/EZIOxtn/InstaBooster?style=flat-square&color=green" alt="License"/>
  </a>

  <!-- Last Commit -->
  <a href="https://github.com/EZIOxtn/InstaBooster/commits/main">
    <img src="https://img.shields.io/github/last-commit/EZIOxtn/InstaBooster?style=flat-square&color=purple" alt="Last Commit"/>
  </a>

</p>



A powerful and modern **full-stack e-commerce solution** built with performance, scalability, and security in mind.

This project includes a **high-performance frontend**, a **feature-rich admin dashboard**, and a **secure backend API** with advanced protections and payment integration.

---

## 📁 Project Structure


githubecammerce/
│
├── ecommerce-react/         # Frontend (User Store)
├── ecommerce-adminPage/     # Admin Dashboard
├── ecommerce-backend/       # Backend API (Node.js / Express)
│
└── ECOM.sql                 # PostgreSQL Database Schema


---

## 📌 Project Description

This is a **production-style e-commerce platform** designed with:

- ⚡ Ultra-fast frontend performance
- 🔐 Advanced backend security
- 💳 Real payment integration
- 🌍 Multi-language support
- 📱 Fully responsive design

---

## ⚙️ Tech Stack

### 🖥️ Frontend
- React.js (Vite / CRA)
- Axios
- Modern UI/UX Design
- Multi-language system (i18n)

### 🛠️ Backend
- Node.js
- Express.js
- JWT Authentication
- Custom Anti-Bot Protection System
- Google OAuth Login

### 💳 Payment
- Mollie Payment Gateway Integration

### 🗄️ Database
- PostgreSQL (Port: 5432)
- SQL Schema (ECOM.sql)

---

## ✨ Features

### 🖥️ Frontend (User Store)

- ⚡ Extremely fast & optimized GUI
- 🎨 Modern & professional UI/UX
- 🌙 Light / Dark mode support
- 🌍 Multi-language support:
  - 🇩🇪 German  
  - 🇸🇦 Arabic  
  - 🇫🇷 French  
  - 🇬🇧 English  
- 📱 Fully responsive (Mobile + Desktop)
- 🛒 Smooth shopping experience

---

### 🧑‍💼 Admin Dashboard

- 📦 Manage products easily
- 📊 Manage orders and users
- ⚡ Simple & efficient interface
- 🔧 Built for speed and usability

---

### 🔐 Backend (Core System)

- 🔑 JWT Authentication System
- 🛡️ Custom Anti-Bot Protection
- 🔐 Secure API architecture
- 🔗 Google Login Integration
- 💳 Mollie Payment System
- ⚡ Optimized REST API

---

## 🖼️ Screenshots

> 📸 Add your screenshots here

/screenshots/home.png
/screenshots/product.png
/screenshots/admin.png

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

git clone https://github.com/EZIOxtn/ecommerce_store.git
cd githubecammerce

---

## 🖥️ Frontend Setup

cd ecommerce-react
npm install
npm run dev

---

## 🧑‍💼 Admin Dashboard Setup

cd ecommerce-adminPage
npm install
npm run dev

---

## 🔧 Backend Setup

cd ecommerce-backend
npm install
node index.js

---

## 🗄️ Database Setup

### 1. Create Database

CREATE DATABASE ecommerce;

### 2. Import SQL File

psql -U your_username -d ecommerce -f ECOM.sql

### 3. Database Includes

- 🛍️ Products  
- 👤 Users  
- 📦 Orders  

---

## 🔐 Environment Variables

Create a `.env` file in ecommerce-backend/:

PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=ecommerce

JWT_SECRET=your_super_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_secret

# Mollie Payment
MOLLIE_API_KEY=your_mollie_api_key

---

## 🔄 API Communication

Frontend uses Axios to communicate with backend:

- /api/products
- /api/users
- /api/orders
- /api/auth
- /api/payment

---

## 📌 Current Status

⚠️ The project is fully functional but still under improvement  
Some features and optimizations are still being updated.

---

## 🚧 Future Improvements

- 📊 Advanced analytics dashboard
- 🔍 Smart search & filtering
- 💳 Additional payment methods
- ⚡ More performance optimizations
- 🔐 Enhanced security layers

---

## 🤝 Contributing

git checkout -b feature-name
git commit -m "Add feature"
git push origin feature-name

---

## 📜 License

MIT License

---

## 👨‍💻 Author

Developed by EZIOxtn
