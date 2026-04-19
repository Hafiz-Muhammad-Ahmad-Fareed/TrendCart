import cartRepository from "../repositories/cart.repository.js";
import userRepository from "../repositories/user.repository.js";
import productRepository from "../repositories/product.repository.js";

const getOrCreateCart = async (clerkId) => {
  const user = await userRepository.findByClerkId(clerkId);
  if (!user) {
    throw new Error("User not found");
  }

  let cart = await cartRepository.findByUserId(user._id);
  if (!cart) {
    cart = await cartRepository.create(user._id);
  }
  return cart;
};

export const getCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  return res.status(200).json({ cart });
};

export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const cart = await getOrCreateCart(req.user.id);

  const product = await productRepository.findById(productId);
  if (!product || product.status !== "active") {
    return res.status(404).json({ message: "Product not found" });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product._id.toString() === productId,
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  const updatedCart = await cartRepository.updateByUserId(cart.user, {
    items: cart.items,
  });

  return res.status(200).json({ cart: updatedCart });
};

export const updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await getOrCreateCart(req.user.id);

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product._id.toString() === productId,
  );

  if (existingItemIndex > -1) {
    if (quantity <= 0) {
      cart.items.splice(existingItemIndex, 1);
    } else {
      cart.items[existingItemIndex].quantity = quantity;
    }
  }

  const updatedCart = await cartRepository.updateByUserId(cart.user, {
    items: cart.items,
  });

  return res.status(200).json({ cart: updatedCart });
};

export const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const cart = await getOrCreateCart(req.user.id);

  cart.items = cart.items.filter(
    (item) => item.product._id.toString() !== productId,
  );

  const updatedCart = await cartRepository.updateByUserId(cart.user, {
    items: cart.items,
  });

  return res.status(200).json({ cart: updatedCart });
};

export const clearCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);

  const updatedCart = await cartRepository.updateByUserId(cart.user, {
    items: [],
  });

  return res.status(200).json({ cart: updatedCart });
};
