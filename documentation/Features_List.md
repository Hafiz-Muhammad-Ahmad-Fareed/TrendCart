# TrendCart - Full Features List

TrendCart is designed to provide a comprehensive e-commerce experience for both customers and store administrators. Below is a detailed breakdown of all features available in the platform.

---

## 🛍️ Customer Experience

### 🔐 Authentication & Profile

- **Modern Authentication**: Powered by Clerk for secure and seamless signup/login.
- **Social Login**: Support for Google, GitHub, and other social providers (via Clerk).
- **User Profile**: Managed profile with personal details and profile image.
- **Order History**: Personalized dashboard to view past and current orders.

### 🔍 Product Discovery

- **Category Browsing**: Dynamic category pages showcasing curated product collections.
- **Product Search & Filtering**: (Optional/Planned) Find products by name, price range, or attributes.
- **Detailed Product Pages**:
  - Multiple product images with zoom functionality.
  - Variant selection (Sizes, Colors).
  - Stock availability indicators.
  - Related/Similar products recommendations.

### ⭐ Reviews & Ratings

- **Verified Reviews**: Only users who have purchased or are registered can leave reviews.
- **Star Rating System**: 1-5 star ratings for products.
- **Detailed Feedback**: Users can leave written comments with their ratings.
- **Review Summary**: Aggregate rating and total review count displayed on product pages.

### 🛒 Shopping Cart

- **Real-time Updates**: Add, remove, and adjust quantities with instant feedback.
- **Persistence**: Cart items are saved across sessions for logged-in users.
- **Guest Cart**: (Optional/Planned) Support for adding items to cart without immediate login.

### 💳 Checkout & Payments

- **Secure Stripe Integration**: Industry-leading payment processing for credit/debit cards.
- **Address Management**: Collect shipping information during the Stripe checkout flow.
- **Order Confirmation**: Instant redirection to a success page upon successful payment.

---

## 🛠️ Admin Dashboard

### 📊 Analytics & Insights

- **Store Overview**: Real-time stats for Total Sales, Total Orders, Total Users, and Total Products.
- **Sales Trends**: Visual charts showing sales performance over time (via Recharts).

### 📁 Category Management

- **Full CRUD**: Create, read, update, and delete categories.
- **Media Upload**: Upload category thumbnail images directly to Cloudinary.
- **Slug Generation**: Automated SEO-friendly URL slugs for categories.

### 📦 Product Management

- **Comprehensive Product Forms**: Manage name, description, price, stock, variants, and categories.
- **Inventory Tracking**: Monitor stock levels and update availability status.
- **Featured Products**: Highlight specific products on the homepage.
- **Image Management**: Support for multiple product images per item.

### 👥 User Management

- **User List**: Overview of all registered users with their details.
- **Role Assignment**: Elevate users to Admin status or revert to standard User role.
- **Account Control**: Ability to delete user accounts if necessary.

### 📋 Order Management

- **Global Order List**: View all orders placed across the store.
- **Status Workflow**: Update order status through logical steps:
  - `Pending` → `Processing` → `Shipped` → `Delivered`.
- **Order Details**: View customer info, shipping address, and items purchased for each order.

---

## ⚙️ Technical Features

- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views using Tailwind CSS.
- **SEO Optimized**: Dynamic meta tags and SEO-friendly slugs for products and categories.
- **Fast Performance**: Powered by Vite and React 19 for a lightning-fast user experience.
- **Reliable Logging**: Server-side activity logging with Winston for easier debugging.
- **Robust Security**: Protected routes, role-based access control (RBAC), and secure API endpoints.
