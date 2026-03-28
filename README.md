# 🛒 Full-Stack E-Commerce Platform

A complete full-stack e-commerce application built with modern technologies. This project includes a **customer-facing storefront**, an **admin dashboard**, and a **robust backend API** with authentication and database integration.

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

This project is a scalable e-commerce solution that provides:

- 🛍️ Product browsing and purchasing system
- 🔐 Secure authentication using JWT
- 🧑‍💼 Admin dashboard to manage products and orders
- 📦 Order management system
- ⚡ RESTful API backend with PostgreSQL integration

---

## ⚙️ Tech Stack

### 🖥️ Frontend
- React.js (Vite / Create React App)
- Axios (API requests)
- HTML5 / CSS3 / JavaScript

### 🛠️ Backend
- Node.js
- Express.js
- JWT (Authentication & Authorization)

### 🗄️ Database
- PostgreSQL (Port: 5432)
- SQL schema provided (ECOM.sql)

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

git clone https://github.com/your-username/githubecammerce.git
cd githubecammerce

---

## 🖥️ Frontend Setup (User Store)

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

- 🛍️ Products Table  
- 👤 Users Table  
- 📦 Orders Table  

---

## 🔐 Environment Variables

Create a `.env` file inside `ecommerce-backend/`:

PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=ecommerce

JWT_SECRET=your_super_secret_key

---

## 🔄 API Communication

- Frontend communicates with backend using Axios
- Backend exposes RESTful endpoints like:
  - /api/products
  - /api/users
  - /api/orders
  - /api/auth

---

## ✨ Features

- 🛒 Add to cart & checkout system
- 🔐 JWT-based authentication
- 📦 Order tracking
- 🧑‍💼 Admin product management
- ⚡ Fast frontend with React

---

## 📌 Future Improvements

- 💳 Payment integration (Stripe / PayPal)
- 📱 Mobile responsiveness improvements
- 🔍 Advanced product search & filtering
- 📊 Analytics dashboard

---

## 🤝 Contributing

Contributions are welcome!

# Fork the repo
# Create a new branch
git checkout -b feature-name

# Commit changes
git commit -m "Added new feature"

# Push and create PR
git push origin feature-name

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Developed by your-name
