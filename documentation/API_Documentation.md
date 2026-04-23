# TrendCart API Documentation

This document provides a comprehensive guide to the API endpoints available in the TrendCart backend.

## 📍 Base URL

```text
Development: http://localhost:3000/api
Production: https://trendcart-sb2x.onrender.com/api
```

---

## 🔐 Authentication

TrendCart uses **Clerk** for authentication. Most endpoints require a valid Clerk session token passed in the `Authorization` header.

```http
Authorization: Bearer <clerk_session_token>
```

---

## 📂 API Endpoints

### 1. Catalog Endpoints

Publicly accessible endpoints for browsing products and categories.

| Method  | Endpoint                             | Description                                     |
| :------ | :----------------------------------- | :---------------------------------------------- |
| **GET** | `/catalog/categories`                | Get all active categories                       |
| **GET** | `/catalog/categories/:slug/products` | Get all products in a specific category         |
| **GET** | `/catalog/products/:slug`            | Get detailed information for a specific product |
| **GET** | `/catalog/products/:slug/similar`    | Get products similar to the specified product   |

---

### 2. Review Endpoints

Manage product reviews and ratings.

| Method   | Endpoint                               | Description                            |
| :------- | :------------------------------------- | :------------------------------------- |
| **GET**  | `/reviews/product/:productId`          | Get all reviews for a specific product |
| **POST** | `/reviews`                             | Create a new review (Requires Auth)    |
| **GET**  | `/reviews/check-can-review/:productId` | Check if the user can review a product |

---

### 3. Order & Checkout Endpoints

Handle shopping cart checkout and order history.

| Method   | Endpoint                   | Description                                              |
| :------- | :------------------------- | :------------------------------------------------------- |
| **POST** | `/orders/checkout-session` | Create a Stripe checkout session                         |
| **GET**  | `/orders/my-orders`        | Get order history for the logged-in user (Requires Auth) |

---

### 4. Admin Endpoints

Restricted endpoints for administrative tasks. All require a user with the `admin` role.

#### Dashboard & Analytics

| Method  | Endpoint           | Description                     |
| :------ | :----------------- | :------------------------------ |
| **GET** | `/admin/dashboard` | Get high-level store statistics |

#### Category Management

| Method     | Endpoint                | Description                                  |
| :--------- | :---------------------- | :------------------------------------------- |
| **GET**    | `/admin/categories`     | Get all categories (including inactive)      |
| **POST**   | `/admin/categories`     | Create a new category (Supports File Upload) |
| **PUT**    | `/admin/categories/:id` | Update an existing category                  |
| **DELETE** | `/admin/categories/:id` | Delete a category                            |

#### Product Management

| Method     | Endpoint              | Description                                 |
| :--------- | :-------------------- | :------------------------------------------ |
| **GET**    | `/admin/products`     | Get all products                            |
| **POST**   | `/admin/products`     | Create a new product (Supports File Upload) |
| **PUT**    | `/admin/products/:id` | Update an existing product                  |
| **DELETE** | `/admin/products/:id` | Delete a product                            |

#### User Management

| Method     | Endpoint                | Description                       |
| :--------- | :---------------------- | :-------------------------------- |
| **GET**    | `/admin/users`          | Get all registered users          |
| **PUT**    | `/admin/users/:id/role` | Update a user's role (admin/user) |
| **DELETE** | `/admin/users/:id`      | Remove a user                     |

#### Order Management

| Method  | Endpoint                   | Description                   |
| :------ | :------------------------- | :---------------------------- |
| **GET** | `/admin/orders`            | Get all customer orders       |
| **PUT** | `/admin/orders/:id/status` | Update the status of an order |

---

### 5. Webhook Endpoints

| Method   | Endpoint          | Description                                          |
| :------- | :---------------- | :--------------------------------------------------- |
| **POST** | `/webhooks/clerk` | Sync Clerk user data with the local MongoDB database |

---

## ⚠️ Error Handling

The API uses standard HTTP status codes:

- `200 OK`: Request succeeded.
- `201 Created`: Resource created successfully.
- `400 Bad Request`: Validation error or invalid input.
- `401 Unauthorized`: Authentication failed or missing.
- `403 Forbidden`: Authenticated but lacks necessary permissions (Admin only).
- `404 Not Found`: Resource does not exist.
- `500 Internal Server Error`: Unexpected server error.

Responses follow a consistent format:

```json
{
  "success": false,
  "message": "Error message description",
  "detail": "Detailed error information (optional)"
}
```
