# Handmade Haven - An E-Commerce for Artisans

Welcome to the ShopHandmade Haven.live GitHub repository for the MERN e-commerce project! This repository contains the source code and assets for the ShopHandmade Haven.live website, built using the MERN stack.

## Introduction

Handmade Haven is an online platform that showcases and sells handmade and unique art and craft products. It aims to provide a marketplace for talented artisans and craftsmen to showcase and sell their creations to a wider audience. The project is built using the MERN stack, which includes MongoDB, Express.js, React, and Node.js.

## Features

- Browse and search for a wide variety of art and craft products.
- View detailed product descriptions, images, and pricing information.
- Add products to your shopping cart for easy purchasing.
- Secure checkout process to complete your purchase.
- User authentication and account management.
- Manage your profile and view order history.
- Contact form to get in touch with the Handmade Haven team.

## Technologies Used

- **Frontend**: React, HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Payment Gateway**: Stripe

## Installation

To run the Handmade Haven MERN e-commerce project locally, follow these steps:

1. Navigate to the project directory:

   ```bash
   cd shopHandmadeHaven.live
   ```

2. Install the dependencies for the backend:

   ```bash
   cd backend
   npm install
   ```

3. Install the dependencies for the frontend:

   ```bash
   cd ../frontend
   npm install
   ```

4. Create a `.env` file in the root directory and set the following environment variables:

   ```bash
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=<your_mongodb_uri>
   JWT_SECRET=<your_jwt_secret>
   STRIPE_API_KEY=<your_stripe_api_key>
   ```

5. Run the backend server:

   ```bash
   cd backend
   npm run dev
   ```

6. Run the frontend server:

   ```bash
   cd frontend
   npm start
   ```

7. Open your browser and navigate to `http://localhost:3000` to view the application.