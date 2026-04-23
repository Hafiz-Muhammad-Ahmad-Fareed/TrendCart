# TrendCart - Modern E-Commerce Platform

TrendCart is a full-stack, feature-rich e-commerce application designed for a seamless shopping experience. It includes a comprehensive customer-facing storefront and a robust admin dashboard for managing products, categories, users, and orders.

## 🚀 Live Demo

[TrendCart Live URL](https://trendcart-sb2x.onrender.com) _(https://trendcart-sb2x.onrender.com)_

---

## 🌟 Key Features

### 🛒 Customer Storefront

- **Seamless Browsing**: Explore products by categories with a modern, responsive UI.
- **Product Discovery**: View detailed product information, including images, sizes, colors, and ratings.
- **Advanced Reviews**: Read and write product reviews with star ratings (verified purchase check).
- **Shopping Cart**: Fully functional cart with real-time updates and persistent storage.
- **Secure Checkout**: Integrated Stripe payment gateway for safe and easy transactions.
- **Order Tracking**: View personal order history and current order status.
- **User Authentication**: Secure login and signup powered by Clerk.

### 🛠️ Admin Dashboard

- **Analytics Overview**: Real-time statistics for total sales, orders, users, and products.
- **Category Management**: Create, update, and delete product categories with image support.
- **Product Management**: Comprehensive CRUD operations for products with inventory tracking.
- **User Management**: Monitor user accounts and manage administrative roles.
- **Order Management**: Track and update the status of customer orders (Pending, Processing, Shipped, Delivered).

---

## 🏗️ Tech Stack

### Frontend

- **React 19** - Modern UI library with Concurrent Mode support.
- **Vite** - Ultra-fast build tool and development server.
- **Tailwind CSS v4** - Utility-first styling for a beautiful, responsive design.
- **Zustand** - Lightweight and scalable state management.
- **Clerk** - Complete user authentication and identity management.
- **Framer Motion** - Smooth animations and transitions.
- **Lucide React** - Elegant and consistent icon set.
- **Recharts** - Interactive data visualization for the admin dashboard.

### Backend

- **Node.js & Express.js** - Scalable server-side environment and web framework.
- **MongoDB & Mongoose** - Flexible NoSQL database with elegant object modeling.
- **Clerk Express** - Secure server-side authentication middleware.
- **Stripe** - Industry-standard payment processing.
- **Cloudinary** - Cloud-based image management and optimization.
- **Winston** - Robust logging for monitoring and debugging.
- **Svix** - Reliable webhook handling for Clerk synchronization.

---

## 📂 Project Structure

```text
TrendCart/
├── client/           # Frontend React application (Vite)
├── server/           # Backend Express API
├── documentation/    # Detailed project documentation
└── package.json      # Root scripts for project-wide management
```

---

## 🛠️ Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Hafiz-Muhammad-Ahmad-Fareed/TrendCart.git
   cd TrendCart
   ```

2. **Install Dependencies**:

   ```bash
   npm run build  # Installs both client and server dependencies
   ```

3. **Set up Environment Variables**:
   Follow the instructions in `documentation/Setup_Installation.md`.
4. **Run the Application**:
   - **Server**: `npm start --prefix server`
   - **Client**: `npm run dev --prefix client`

---

## 📄 Documentation

For more detailed information, please refer to:

- [API Documentation](documentation/API_Documentation.md)
- [Full Features List](documentation/Features_List.md)
- [Setup &amp; Installation Guide](documentation/Setup_Installation.md)

---

## ⚖️ License

This project is licensed under the ISC License.
