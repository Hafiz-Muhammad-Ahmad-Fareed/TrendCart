import asyncHandler from "../utils/async_handler.js";
import * as cartService from "../services/cart.service.js";

export const getCart = asyncHandler(cartService.getCart);
export const addToCart = asyncHandler(cartService.addToCart);
export const updateQuantity = asyncHandler(cartService.updateQuantity);
export const removeFromCart = asyncHandler(cartService.removeFromCart);
export const clearCart = asyncHandler(cartService.clearCart);
