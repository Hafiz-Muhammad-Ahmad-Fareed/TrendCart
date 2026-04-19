import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const useCatalogStore = create((set) => ({
  categories: [],
  currentCategory: null,
  categoryProducts: [],
  currentProduct: null,
  similarProducts: [],
  isCategoriesLoading: false,
  isCategoryProductsLoading: false,
  isProductDetailsLoading: false,

  fetchCategories: async () => {
    set({ isCategoriesLoading: true });

    try {
      const res = await axiosInstance.get("/categories");

      set({ categories: res.data.categories || [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load catalog");
    } finally {
      set({ isCategoriesLoading: false });
    }
  },

  fetchCategoryProducts: async (slug) => {
    set({
      isCategoryProductsLoading: true,
      currentCategory: null,
      categoryProducts: [],
    });

    try {
      const res = await axiosInstance.get(`/categories/${slug}/products`);

      set({
        currentCategory: res.data.category,
        categoryProducts: res.data.products || [],
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load category products",
      );
    } finally {
      set({ isCategoryProductsLoading: false });
    }
  },

  fetchProductDetails: async (slug) => {
    set({
      isProductDetailsLoading: true,
      currentProduct: null,
      similarProducts: [],
    });

    try {
      const [productRes, similarRes] = await Promise.all([
        axiosInstance.get(`/products/${slug}`),
        axiosInstance.get(`/products/${slug}/similar`),
      ]);

      set({
        currentProduct: productRes.data.product,
        similarProducts: similarRes.data.products || [],
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load product details",
      );
    } finally {
      set({ isProductDetailsLoading: false });
    }
  },
}));

export default useCatalogStore;
