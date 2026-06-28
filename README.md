# 🎨 Handmade Haven

> **Empowering Artisans Through Technology**
> A modern MERN-based e-commerce platform that connects local artisans with customers worldwide through a secure, responsive, and intelligent shopping experience.

<p align="center">
  <a href="https://handmade-haven-live.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Live_Demo-Visit_Website-b85c38?style=for-the-badge" />
  </a>
  <img src="https://img.shields.io/badge/Status-Live-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
</p>

---

## 🌐 Live Demo

🔗 **Website:** https://handmade-haven-live.vercel.app/

---

# 📖 Overview

Handmade Haven is a production-ready full-stack e-commerce application developed using the **MERN Stack**. The platform provides artisans with a digital marketplace to showcase handcrafted products while offering customers a seamless shopping experience with secure authentication, multiple payment methods, intelligent assistance, and responsive design.

The project follows a modern client-server architecture with independent frontend and backend deployments for scalability and maintainability.

---

# ✨ Features

## 🛍️ Shopping Experience

* Browse handcrafted products
* Search and filter products
* Product reviews and ratings
* Product categories
* Responsive product gallery
* Shopping cart management
* Secure checkout

---

## 👤 User Management

* User Registration & Login
* JWT Authentication
* User Profile Management
* Order History
* Shipping Address Management

---

## 💳 Payments

* PayPal Payment Gateway
* Cash on Delivery (COD)
* Secure Order Placement
* Payment Status Tracking

---

## 📦 Order Management

* Order Tracking
* Delivery Progress UI
* Admin Delivery Approval
* Seller Delivery Management
* Order History

---

## 🤖 AI Chat Assistant

An intelligent chatbot integrated with the application that assists users by:

* Tracking orders
* Answering product queries
* Recommending products
* Explaining payment methods
* Providing shipping information
* Guiding users throughout the website

---

## 📬 Contact System

* Contact Form
* Backend Email Integration
* Direct Communication with Administrator

---

## 📱 Responsive Design

The application is optimized for:

* 📱 Mobile Devices
* 💻 Laptops
* 🖥️ Desktop
* 📲 Tablets

with a modern responsive UI and improved navigation experience.

---

# 🏗️ System Architecture

```text
                 User
                  │
                  ▼
        React Frontend (Vercel)
                  │
          Axios API Requests
                  │
                  ▼
      Express.js Backend (Render)
                  │
      ┌───────────┼───────────┐
      │           │           │
 MongoDB      PayPal API   Chat Services
   Atlas
```

---

# 🛠️ Technology Stack

## Frontend

* React.js
* Redux
* React Router
* React Bootstrap
* Styled Components
* Axios

---

## Backend

* Node.js
* Express.js
* JWT Authentication
* Nodemailer
* Multer

---

## Database

* MongoDB Atlas
* Mongoose

---

## Deployment

| Service  | Platform      |
| -------- | ------------- |
| Frontend | Vercel        |
| Backend  | Render        |
| Database | MongoDB Atlas |

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/DRSTRANGE-cloud/Handmade-Haven.git

cd Handmade-Haven
```

---

## Install Backend

```bash
cd backend
npm install
```

---

## Install Frontend

```bash
cd ../frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside the **backend** folder.

```env
NODE_ENV=development

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

PAYPAL_CLIENT_ID=your_paypal_client_id

CHAT_API_KEY=your_chat_api_key

EMAIL_USER=your_email@gmail.com

EMAIL_PASS=your_google_app_password
```

---

## Run Backend

```bash
cd backend
npm run dev
```

---

## Run Frontend

```bash
cd frontend
npm start
```

Open:

```
http://localhost:3000
```

---

# 📂 Project Structure

```
Handmade-Haven
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
├── frontend
│   ├── actions
│   ├── components
│   ├── reducers
│   ├── screens
│   ├── styles
│   └── App.js
│
└── README.md
```

---

# 🔥 Recent Enhancements

* AI-powered chatbot integration
* Cash on Delivery (COD) payment support
* Modern payment selection interface
* Responsive mobile navigation
* Delivery tracking interface
* Contact form backend integration
* Improved Linux-compatible image handling
* Render + Vercel deployment optimization
* Better checkout experience
* UI/UX refinements across the application

---

# 🚀 Future Roadmap

* AI Product Recommendation Engine
* Razorpay Integration
* Wishlist System
* Seller Analytics Dashboard
* Push Notifications
* PWA Support
* Multi-language Support
* Product Recommendation Engine
* Admin Analytics Dashboard

---

# 🤝 Contributing

Contributions, feature requests, and bug reports are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

# 👨‍💻 Developer

**Deepak Yadav**

Software Engineering Student | MERN Stack Developer | AI Enthusiast

I enjoy building scalable full-stack applications that combine intuitive user experiences with modern backend architectures.

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future development.

---

## 📄 License

This project is licensed under the **MIT License**.
