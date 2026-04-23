# TrendCart - Setup & Installation Guide

Follow this guide to set up TrendCart on your local machine for development.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.x or higher)
- **npm** (v10.x or higher)
- **MongoDB** (Local or Atlas)
- **Clerk Account** (For Authentication)
- **Stripe Account** (For Payments)
- **Cloudinary Account** (For Image Uploads)

---

## 🛠️ Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Hafiz-Muhammad-Ahmad-Fareed/TrendCart.git
cd TrendCart
```

### 2. Install Dependencies

Install dependencies for both the client and server using the root script:

```bash
npm run build
```

---

## 🔐 Environment Configuration

You need to create `.env` files in both the `server` and `client` directories.

### Server Environment Variables (`server/.env`)

Create a `.env` file in the `server` directory and add the following:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
WEBHOOK_SECRET=your_clerk_webhook_signing_secret

# Stripe Payments
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLIENT_URL=http://localhost:5173

# Cloudinary Media
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Client Environment Variables (`client/.env`)

Create a `.env` file in the `client` directory:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# API Configuration
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## 🚀 Running the Application

### Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:3000`.

### Start the Frontend Client

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`.

---

## 🧪 Admin Access

TrendCart includes an automatic seeding script for a default admin user.
When you start the server for the first time, it will attempt to create or update an admin user with the following credentials (configured in `server/utils/seedAdmin.js`):

- **Email**: `heden25187@ryzid.com`
- **Password**: `SuperSecurePassword123!`

You can use these credentials to log in and access the Admin Dashboard. Alternatively, you can sign up with your own account and manually update your `role` to `admin` in the MongoDB database.

---

## 🛠️ Troubleshooting

- **MongoDB Connection**: Ensure your IP address is whitelisted in MongoDB Atlas or your local MongoDB service is running.
- **Clerk Webhooks**: If you are testing webhooks locally, use a tool like **ngrok** to expose your local server and update the webhook URL in the Clerk Dashboard.
- **Stripe Webhooks**: Use the Stripe CLI to forward webhooks to your local server:
  ```bash
  stripe listen --forward-to localhost:3000/api/orders/webhook
  ```
- **CORS Issues**: Verify that the `CLIENT_URL` in your server's `.env` matches the URL your frontend is running on.
