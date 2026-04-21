import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      isCartLoading: false,

      addToCart: (product) => {
        set((state) => {
          const selectedSize = product.selectedSize || "";
          const selectedColor = product.selectedColor || "";
          const selectedImage = product.selectedImage || "";
          const existingItem = state.cart.find(
            (item) =>
              item.product._id === product._id &&
              (item.selectedSize || "") === selectedSize &&
              (item.selectedColor || "") === selectedColor &&
              (item.selectedImage || "") === selectedImage,
          );
          let newCart;
          if (existingItem) {
            newCart = state.cart.map((item) =>
              item.product._id === product._id &&
              (item.selectedSize || "") === selectedSize &&
              (item.selectedColor || "") === selectedColor &&
              (item.selectedImage || "") === selectedImage
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                    selectedImage: product.selectedImage || item.selectedImage,
                  }
                : item,
            );
          } else {
            newCart = [
              ...state.cart,
              {
                product,
                quantity: 1,
                selectedSize,
                selectedColor,
                selectedImage,
              },
            ];
          }
          toast.success("Added to cart");
          return { cart: newCart };
        });
      },

      updateQuantity: (
        productId,
        quantity,
        selectedSize = "",
        selectedColor = "",
        selectedImage = "",
      ) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product._id === productId &&
            (item.selectedSize || "") === selectedSize &&
            (item.selectedColor || "") === selectedColor &&
            (item.selectedImage || "") === selectedImage
              ? { ...item, quantity }
              : item,
          ),
        }));
      },

      removeFromCart: (
        productId,
        selectedSize = "",
        selectedColor = "",
        selectedImage = "",
      ) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) =>
              !(
                item.product._id === productId &&
                (item.selectedSize || "") === selectedSize &&
                (item.selectedColor || "") === selectedColor &&
                (item.selectedImage || "") === selectedImage
              ),
          ),
        }));
        toast.success("Removed from cart");
      },

      clearCart: () => {
        set({ cart: [] });
      },

      checkout: async () => {
        const { cart } = get();
        if (cart.length === 0) {
          toast.error("Cart is empty");
          return;
        }

        try {
          const res = await axiosInstance.post("/orders/checkout-session", {
            cartItems: cart.map((item) => ({
              productId: item.product._id,
              quantity: item.quantity,
              selectedSize: item.selectedSize,
              selectedColor: item.selectedColor,
              selectedImage: item.selectedImage,
            })),
          });
          if (res.data.url) {
            window.location.href = res.data.url;
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Checkout failed");
        }
      },
    }),
    {
      name: "trendcart-cart",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useCartStore;
