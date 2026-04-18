import categoryRepository from "../repositories/category.repository.js";
import productRepository from "../repositories/product.repository.js";
import userRepository from "../repositories/user.repository.js";
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
  const [categories, products, activeProducts, users] = await Promise.all([
    categoryRepository.countDocuments(),
    productRepository.countDocuments(),
    productRepository.countDocuments({ status: "active" }),
    userRepository.countDocuments(),
  ]);

  return res.status(200).json({
    counts: {
      categories,
      products,
      activeProducts,
      users,
    },
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
    return res.status(400).json({ message: "Selected category does not exist" });
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
    return res.status(400).json({ message: "Selected category does not exist" });
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
    isFeatured: parseBoolean(
      req.body.isFeatured,
      existingProduct.isFeatured,
    ),
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
