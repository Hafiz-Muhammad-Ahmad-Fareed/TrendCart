import categoryRepository from "../repositories/category.repository.js";
import productRepository from "../repositories/product.repository.js";

const shapeCategory = (category) => ({
  _id: category._id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  image: category.image,
  isActive: category.isActive,
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
});

export const getPublicCategories = async (req, res) => {
  const categories = await categoryRepository.findPublic();

  return res.status(200).json({
    categories: categories.map(shapeCategory),
  });
};

export const getProductsByCategorySlug = async (req, res) => {
  const category = await categoryRepository.findBySlug(req.params.slug);

  if (!category || !category.isActive) {
    return res.status(404).json({ message: "Category not found" });
  }

  const products = await productRepository.findPublicByCategoryId(category._id);

  return res.status(200).json({
    category: shapeCategory(category),
    products: products.map(shapeProduct),
  });
};

export const getProductBySlug = async (req, res) => {
  const product = await productRepository.findBySlug(req.params.slug);

  if (!product || product.status !== "active") {
    return res.status(404).json({ message: "Product not found" });
  }

  return res.status(200).json({
    product: shapeProduct(product),
  });
};

export const getSimilarProducts = async (req, res) => {
  const product = await productRepository.findBySlug(req.params.slug);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const products = await productRepository.findSimilar(
    product.category._id,
    product._id,
  );

  return res.status(200).json({
    products: products.map(shapeProduct),
  });
};
