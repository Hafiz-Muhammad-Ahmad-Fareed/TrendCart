import { clerkClient } from "@clerk/express";
import categoryRepository from "../repositories/category.repository.js";
import productRepository from "../repositories/product.repository.js";
import userRepository from "../repositories/user.repository.js";
import orderRepository from "../repositories/order.repository.js";
import { resolveImageUpload } from "../utils/cloudinary_upload.js";
import { generateUniqueSlug } from "../utils/slugify.js";

const parseBoolean = (value, defaultValue = false) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue === "true") {
      return true;
    }

    if (normalizedValue === "false") {
      return false;
    }
  }

  return defaultValue;
};

const parseNumber = (value, fallback = 0) => {
  const parsedValue = Number(value);

  if (Number.isFinite(parsedValue)) {
    return parsedValue;
  }

  return fallback;
};

const shapeCategory = (category) => ({
  _id: category._id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  image: category.image,
  isActive: category.isActive,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

const shapeProduct = (product) => ({
  _id: product._id,
  name: product.name,
  slug: product.slug,
  description: product.description,
  price: product.price,
  image: product.image,
  stockQuantity: product.stockQuantity,
  isFeatured: product.isFeatured,
  status: product.status,
  category: product.category
    ? {
        _id: product.category._id,
        name: product.category.name,
        slug: product.category.slug,
        isActive: product.category.isActive,
      }
    : null,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

const shapeUser = (user) => ({
  _id: user._id,
  clerkId: user.clerkId,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  fullName: user.fullName,
  profileImage: user.profileImage,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const validateCategory = (body) => {
  if (!body.name?.trim()) {
    return "Category name is required";
  }

  return null;
};

const validateProduct = (body) => {
  if (!body.name?.trim()) {
    return "Product name is required";
  }

  if (!body.categoryId?.trim()) {
    return "Product category is required";
  }

  const price = Number(body.price);

  if (!Number.isFinite(price) || price < 0) {
    return "Product price must be a valid non-negative number";
  }

  const stockQuantity = Number(body.stockQuantity);

  if (!Number.isFinite(stockQuantity) || stockQuantity < 0) {
    return "Stock quantity must be a valid non-negative number";
  }

  return null;
};

export const getDashboardStats = async (req, res) => {
  const { year, month, range } = req.query;

  let startDate, endDate;

  if (range === "7days") {
    endDate = new Date();
    endDate.setUTCHours(23, 59, 59, 999);
    startDate = new Date(endDate);
    startDate.setUTCDate(startDate.getUTCDate() - 6);
    startDate.setUTCHours(0, 0, 0, 0);
  } else if (year) {
    const y = parseInt(year);
    if (month) {
      const m = parseInt(month) - 1; // month is 1-indexed from query
      startDate = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
      endDate = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999));
    } else {
      startDate = new Date(Date.UTC(y, 0, 1, 0, 0, 0, 0));
      endDate = new Date(Date.UTC(y, 11, 31, 23, 59, 59, 999));
    }
  }

  const [categories, products, activeProducts, users] = await Promise.all([
    categoryRepository.countDocuments(),
    productRepository.countDocuments(),
    productRepository.countDocuments({ status: "active" }),
    userRepository.countDocuments(),
  ]);

  const orders = await orderRepository.findAll({ startDate, endDate });
  const totalOrders = orders.length;

  // Analytics Calculations
  const totalRevenue = orders.reduce((sum, order) => {
    if (order.paymentStatus === "paid") {
      return sum + order.totalAmount;
    }
    return sum;
  }, 0);

  // 1. Sales over time
  // If Last 7 Days is selected, show last 7 days.
  // If Month is selected, show all days of that month.
  // If Year is selected (and no month), show months of that year.
  let salesOverTime = [];

  if (range === "7days" || (year && month)) {
    // Show days
    const daysCount = range === "7days" ? 7 : new Date(year, month, 0).getDate();
    const tempStartDate = new Date(startDate);

    for (let i = 0; i < daysCount; i++) {
      const d = new Date(tempStartDate);
      d.setUTCDate(d.getUTCDate() + i);
      salesOverTime.push({
        date: d.toISOString().split("T")[0],
        sales: 0,
      });
    }

    orders.forEach((order) => {
      if (order.paymentStatus === "paid") {
        const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
        const dayData = salesOverTime.find((d) => d.date === orderDate);
        if (dayData) {
          dayData.sales += order.totalAmount;
        }
      }
    });
  } else if (year && !month) {
    // Show months of the year
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    salesOverTime = monthNames.map((name) => ({ date: name, sales: 0 }));

    orders.forEach((order) => {
      if (order.paymentStatus === "paid") {
        const orderMonth = new Date(order.createdAt).getUTCMonth();
        salesOverTime[orderMonth].sales += order.totalAmount;
      }
    });
  } else {
    // Default to last 7 days if no filter
    const last7Days = [];
    const end = new Date();
    end.setUTCHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 6);
    start.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setUTCDate(d.getUTCDate() + i);
      last7Days.push({
        date: d.toISOString().split("T")[0],
        sales: 0,
      });
    }

    orders.forEach((order) => {
      if (order.paymentStatus === "paid") {
        const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
        const dayData = last7Days.find((d) => d.date === orderDate);
        if (dayData) {
          dayData.sales += order.totalAmount;
        }
      }
    });
    salesOverTime = last7Days;
  }

  // 2. Order status distribution
  const statusDistribution = [
    { name: "Pending", value: 0 },
    { name: "Processing", value: 0 },
    { name: "Shipped", value: 0 },
    { name: "Delivered", value: 0 },
    { name: "Cancelled", value: 0 },
  ];

  orders.forEach((order) => {
    const status = order.status.charAt(0).toUpperCase() + order.status.slice(1);
    const item = statusDistribution.find((s) => s.name === status);
    if (item) {
      item.value += 1;
    }
  });

  // 3. Top products by revenue
  const productRevenueMap = {};
  orders.forEach((order) => {
    if (order.paymentStatus === "paid") {
      order.items.forEach((item) => {
        if (!productRevenueMap[item.name]) {
          productRevenueMap[item.name] = 0;
        }
        productRevenueMap[item.name] += item.price * item.quantity;
      });
    }
  });

  const topProducts = Object.entries(productRevenueMap)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return res.status(200).json({
    counts: {
      categories,
      products,
      activeProducts,
      users,
      orders: totalOrders,
      totalRevenue,
    },
    analytics: {
      salesOverTime,
      statusDistribution,
      topProducts,
    },
  });
};

export const getOrders = async (req, res) => {
  const orders = await orderRepository.findAll();
  return res.status(200).json({ orders });
};

export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const order = await orderRepository.findById(id);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const updatedOrder = await orderRepository.updateById(id, { status });

  return res.status(200).json({
    message: "Order status updated",
    order: updatedOrder,
  });
};

export const getCategories = async (req, res) => {
  const categories = await categoryRepository.findAll();

  return res.status(200).json({
    categories: categories.map(shapeCategory),
  });
};

export const createCategory = async (req, res) => {
  const validationError = validateCategory(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const slug = await generateUniqueSlug(
    categoryRepository,
    req.body.slug?.trim() || req.body.name,
  );
  const image = await resolveImageUpload({
    file: req.file,
    image: req.body.image,
    folder: "trendcart/categories",
  });
  const category = await categoryRepository.create({
    name: req.body.name.trim(),
    slug,
    description: req.body.description?.trim() || "",
    image: image || "",
    isActive: parseBoolean(req.body.isActive, true),
  });

  return res.status(201).json({
    message: "Category created successfully",
    category: shapeCategory(category.toObject()),
  });
};

export const updateCategory = async (req, res) => {
  const existingCategory = await categoryRepository.findById(req.params.id);

  if (!existingCategory) {
    return res.status(404).json({ message: "Category not found" });
  }

  const validationError = validateCategory(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const slug = await generateUniqueSlug(
    categoryRepository,
    req.body.slug?.trim() || req.body.name,
    req.params.id,
  );
  const image = await resolveImageUpload({
    file: req.file,
    image: req.body.image,
    folder: "trendcart/categories",
  });
  const category = await categoryRepository.updateById(req.params.id, {
    name: req.body.name.trim(),
    slug,
    description: req.body.description?.trim() || "",
    isActive: parseBoolean(req.body.isActive, existingCategory.isActive),
    ...(image ? { image } : {}),
  });

  return res.status(200).json({
    message: "Category updated successfully",
    category: shapeCategory(category),
  });
};

export const deleteCategory = async (req, res) => {
  const category = await categoryRepository.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  await Promise.all([
    productRepository.deleteManyByCategoryId(req.params.id),
    categoryRepository.deleteById(req.params.id),
  ]);

  return res.status(200).json({
    message: "Category deleted successfully",
  });
};

export const getProducts = async (req, res) => {
  const products = await productRepository.findAll({
    status: req.query.status,
    categoryId: req.query.categoryId,
  });

  return res.status(200).json({
    products: products.map(shapeProduct),
  });
};

export const createProduct = async (req, res) => {
  const validationError = validateProduct(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const category = await categoryRepository.findById(req.body.categoryId);

  if (!category) {
    return res
      .status(400)
      .json({ message: "Selected category does not exist" });
  }

  const slug = await generateUniqueSlug(
    productRepository,
    req.body.slug?.trim() || req.body.name,
  );
  const image = await resolveImageUpload({
    file: req.file,
    image: req.body.image,
    folder: "trendcart/products",
  });
  const product = await productRepository.create({
    name: req.body.name.trim(),
    slug,
    description: req.body.description?.trim() || "",
    price: parseNumber(req.body.price),
    image: image || "",
    category: req.body.categoryId,
    stockQuantity: parseNumber(req.body.stockQuantity),
    isFeatured: parseBoolean(req.body.isFeatured, false),
    status: req.body.status === "inactive" ? "inactive" : "active",
  });
  const createdProduct = await productRepository.findById(product._id);

  return res.status(201).json({
    message: "Product created successfully",
    product: shapeProduct(createdProduct),
  });
};

export const updateProduct = async (req, res) => {
  const existingProduct = await productRepository.findById(req.params.id);

  if (!existingProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  const validationError = validateProduct(req.body);

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const category = await categoryRepository.findById(req.body.categoryId);

  if (!category) {
    return res
      .status(400)
      .json({ message: "Selected category does not exist" });
  }

  const slug = await generateUniqueSlug(
    productRepository,
    req.body.slug?.trim() || req.body.name,
    req.params.id,
  );
  const image = await resolveImageUpload({
    file: req.file,
    image: req.body.image,
    folder: "trendcart/products",
  });
  const product = await productRepository.updateById(req.params.id, {
    name: req.body.name.trim(),
    slug,
    description: req.body.description?.trim() || "",
    price: parseNumber(req.body.price),
    category: req.body.categoryId,
    stockQuantity: parseNumber(req.body.stockQuantity),
    isFeatured: parseBoolean(req.body.isFeatured, existingProduct.isFeatured),
    status: req.body.status === "inactive" ? "inactive" : "active",
    ...(image ? { image } : {}),
  });

  return res.status(200).json({
    message: "Product updated successfully",
    product: shapeProduct(product),
  });
};

export const deleteProduct = async (req, res) => {
  const deletedProduct = await productRepository.deleteById(req.params.id);

  if (!deletedProduct) {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.status(200).json({
    message: "Product deleted successfully",
  });
};

export const getUsers = async (req, res) => {
  const users = await userRepository.findAll();

  return res.status(200).json({
    users: users.map(shapeUser),
  });
};

export const updateUserRole = async (req, res) => {
  const { role } = req.body;

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await userRepository.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const updatedUser = await userRepository.updateById(req.params.id, { role });

  return res.status(200).json({
    message: "User role updated successfully",
    user: shapeUser(updatedUser),
  });
};

export const deleteUser = async (req, res) => {
  const user = await userRepository.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role === "admin") {
    const adminCount = await userRepository.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      return res
        .status(400)
        .json({ message: "Cannot delete the only admin account" });
    }
  }

  // Delete from Clerk first to ensure consistency
  if (user.clerkId) {
    try {
      await clerkClient.users.deleteUser(user.clerkId);
    } catch (error) {
      // If user not found in Clerk, we might still want to delete from local DB
      // but if it's another error (auth, network), we might want to fail.
      // For now, log it and proceed if it's a 404 (already deleted in Clerk)
      if (error.status !== 404) {
        console.error("❌ Error deleting user from Clerk:", error.message);
        return res.status(500).json({
          message: "Failed to delete user from authentication service",
          details: error.message,
        });
      }
    }
  }

  await userRepository.deleteById(req.params.id);

  return res.status(200).json({
    message: "User deleted successfully",
  });
};
