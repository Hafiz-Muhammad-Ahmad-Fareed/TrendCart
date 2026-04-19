import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const useCartStore = create((set, get) => ({
  cart: null,
  isCartLoading: false,

  fetchCart: async () => {
    set({ isCartLoading: true });
    try {
      const res = await axiosInstance.get("/cart");
      set({ cart: res.data.cart });
    } catch (error) {
      // Don't toast error here as it might be common for guest users if not handled properly
      set({ cart: null });
    } finally {
      set({ isCartLoading: false });
    }
  },

  addToCart: async (productId) => {
    try {
      const res = await axiosInstance.post("/cart/add", { productId });
      set({ cart: res.data.cart });
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      const res = await axiosInstance.put("/cart/update-quantity", {
        productId,
        quantity,
      });
      set({ cart: res.data.cart });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  },

  removeFromCart: async (productId) => {
    try {
      const res = await axiosInstance.delete(`/cart/remove/${productId}`);
      set({ cart: res.data.cart });
      toast.success("Removed from cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove from cart");
    }
  },

  clearCart: async () => {
    try {
      const res = await axiosInstance.delete("/cart/clear");
      set({ cart: res.data.cart });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear cart");
    }
  },
}));

export default useCartStore;
