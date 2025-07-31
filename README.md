## 🛍️ Handmade Haven – An E-Commerce Platform for Artisans 🎨

Welcome to the official GitHub repository for **[ShopHandmadeHaven.live](https://ShopHandmadeHaven.live)** – a MERN-stack-based e-commerce web application that empowers local artisans to showcase and sell their handcrafted creations to a global audience.

---

## ✨ Introduction

**Handmade Haven** is a modern, full-featured online marketplace built using the **MERN stack** (MongoDB, Express.js, React, Node.js). It bridges the gap between skilled artisans and customers by providing a clean, intuitive interface for browsing, purchasing, and managing handmade goods.

Whether you're an artisan looking to sell your work or a customer in search of something unique, Handmade Haven is your go-to platform.

---

## 🌟 Key Features

- 🔍 **Smart Product Search** – Browse and filter a wide range of handmade art and craft items.
- 🖼️ **Detailed Product Pages** – View product descriptions, pricing, and high-quality images.
- 🛒 **Shopping Cart** – Add, remove, and manage your items with ease.
- 🔒 **Secure Checkout** – Integrates Stripe for reliable and secure payments.
- 👤 **User Authentication** – Register, log in, and manage user accounts.
- 📜 **Order History** – View past orders and track recent purchases.
- ✉️ **Contact Form** – Easily get in touch with the Handmade Haven support team.

---

## 🛠️ Tech Stack

| Layer        | Technologies Used              |
| ------------ | ------------------------------ |
| **Frontend** | React, HTML5, CSS3, JavaScript |
| **Backend**  | Node.js, Express.js            |
| **Database** | MongoDB (via Mongoose)         |
| **Payments** | Stripe API                     |
| **Auth**     | JWT (JSON Web Tokens)          |

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/shopHandmadeHaven.live.git
cd shopHandmadeHaven.live
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the `/backend` directory and add the following:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
STRIPE_API_KEY=<your_stripe_api_key>
```

> ⚠️ **Never commit `.env` files to version control.**

### 5. Run the Application

Start the backend server:

```bash
cd backend
npm run dev
```

Start the frontend server:

```bash
cd ../frontend
npm start
```

Now, open your browser and visit [http://localhost:3000](http://localhost:3000) to explore the site. 🌐

---

## 🤝 Contributing

We welcome contributions! Feel free to fork this repository, submit pull requests, or open issues for improvements and bug reports.

---

## 📄 License

This project is licensed under the **MIT License**
