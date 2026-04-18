import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const useCatalogStore = create((set) => ({
  categories: [],
  currentCategory: null,
  categoryProducts: [],
  isCategoriesLoading: false,
  isCategoryProductsLoading: false,

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
}));

export default useCatalogStore;
