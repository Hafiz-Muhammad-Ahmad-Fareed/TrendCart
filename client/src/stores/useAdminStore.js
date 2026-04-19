import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const appendValue = (formData, key, value) => {
  if (value === undefined || value === null) {
    return;
  }

  formData.append(key, value);
};

const buildCategoryFormData = (payload) => {
  const formData = new FormData();

  appendValue(formData, "name", payload.name);
  appendValue(formData, "slug", payload.slug);
  appendValue(formData, "description", payload.description);
  appendValue(formData, "isActive", String(payload.isActive));

  if (payload.imageFile) {
    appendValue(formData, "image", payload.imageFile);
  } else if (payload.image) {
    appendValue(formData, "image", payload.image);
  }

  return formData;
};

const buildProductFormData = (payload) => {
  const formData = new FormData();

  appendValue(formData, "name", payload.name);
  appendValue(formData, "slug", payload.slug);
  appendValue(formData, "description", payload.description);
  appendValue(formData, "price", payload.price);
  appendValue(formData, "categoryId", payload.categoryId);
  appendValue(formData, "stockQuantity", payload.stockQuantity);
  appendValue(formData, "isFeatured", String(payload.isFeatured));
  appendValue(formData, "status", payload.status);

  if (payload.imageFile) {
    appendValue(formData, "image", payload.imageFile);
  } else if (payload.image) {
    appendValue(formData, "image", payload.image);
  }

  return formData;
};

const useAdminStore = create((set, get) => ({
  counts: {
    categories: 0,
    products: 0,
    activeProducts: 0,
    users: 0,
    orders: 0,
    totalRevenue: 0,
  },
  analytics: null,
  categories: [],
  products: [],
  users: [],
  orders: [],
  isDashboardLoading: false,
  isCategoriesLoading: false,
  isProductsLoading: false,
  isUsersLoading: false,
  isOrdersLoading: false,
  isSavingCategory: false,
  isSavingProduct: false,
  isUpdatingUser: false,
  isUpdatingOrder: false,
  isDeleting: false,

  fetchDashboard: async () => {
    set({ isDashboardLoading: true });

    try {
      const res = await axiosInstance.get("/admin/dashboard");

      set({ counts: res.data.counts, analytics: res.data.analytics });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      set({ isDashboardLoading: false });
    }
  },

  fetchCategories: async () => {
    set({ isCategoriesLoading: true });

    try {
      const res = await axiosInstance.get("/admin/categories");

      set({ categories: res.data.categories || [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load categories");
    } finally {
      set({ isCategoriesLoading: false });
    }
  },

  fetchProducts: async (filters = {}) => {
    set({ isProductsLoading: true });

    try {
      const params = {};

      if (filters.status) {
        params.status = filters.status;
      }

      if (filters.categoryId) {
        params.categoryId = filters.categoryId;
      }

      const res = await axiosInstance.get("/admin/products", { params });

      set({ products: res.data.products || [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load products");
    } finally {
      set({ isProductsLoading: false });
    }
  },

  fetchUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/admin/users");

      set({ users: res.data.users || [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  saveCategory: async (payload, categoryId = null) => {
    set({ isSavingCategory: true });

    try {
      const formData = buildCategoryFormData(payload);
      const res = categoryId
        ? await axiosInstance.put(`/admin/categories/${categoryId}`, formData)
        : await axiosInstance.post("/admin/categories", formData);

      toast.success(res.data.message);
      await Promise.all([get().fetchCategories(), get().fetchDashboard()]);
      return res.data.category;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save category");
      return null;
    } finally {
      set({ isSavingCategory: false });
    }
  },

  deleteCategory: async (categoryId) => {
    set({ isDeleting: true });

    try {
      const res = await axiosInstance.delete(`/admin/categories/${categoryId}`);

      toast.success(res.data.message);
      await Promise.all([
        get().fetchCategories(),
        get().fetchProducts(),
        get().fetchDashboard(),
      ]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      set({ isDeleting: false });
    }
  },

  saveProduct: async (payload, productId = null, filters = {}) => {
    set({ isSavingProduct: true });

    try {
      const formData = buildProductFormData(payload);
      const res = productId
        ? await axiosInstance.put(`/admin/products/${productId}`, formData)
        : await axiosInstance.post("/admin/products", formData);

      toast.success(res.data.message);
      await Promise.all([get().fetchProducts(filters), get().fetchDashboard()]);
      return res.data.product;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
      return null;
    } finally {
      set({ isSavingProduct: false });
    }
  },

  deleteProduct: async (productId, filters = {}) => {
    set({ isDeleting: true });

    try {
      const res = await axiosInstance.delete(`/admin/products/${productId}`);

      toast.success(res.data.message);
      await Promise.all([get().fetchProducts(filters), get().fetchDashboard()]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      set({ isDeleting: false });
    }
  },

  updateUserRole: async (userId, role) => {
    set({ isUpdatingUser: true });

    try {
      const res = await axiosInstance.put(`/admin/users/${userId}/role`, {
        role,
      });

      toast.success(res.data.message);
      await get().fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user role");
    } finally {
      set({ isUpdatingUser: false });
    }
  },

  deleteUser: async (userId) => {
    set({ isDeleting: true });

    try {
      const res = await axiosInstance.delete(`/admin/users/${userId}`);

      toast.success(res.data.message);
      await Promise.all([get().fetchUsers(), get().fetchDashboard()]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      set({ isDeleting: false });
    }
  },
  fetchOrders: async () => {
    set({ isOrdersLoading: true });
    try {
      const res = await axiosInstance.get("/admin/orders");
      set({ orders: res.data.orders || [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally {
      set({ isOrdersLoading: false });
    }
  },
  updateOrderStatus: async (orderId, status) => {
    set({ isUpdatingOrder: true });
    try {
      const res = await axiosInstance.put(`/admin/orders/${orderId}/status`, {
        status,
      });
      toast.success(res.data.message);
      await get().fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update order status",
      );
    } finally {
      set({ isUpdatingOrder: false });
    }
  },
}));

export default useAdminStore;
