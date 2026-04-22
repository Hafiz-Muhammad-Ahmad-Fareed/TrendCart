import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

const useReviewStore = create((set, get) => ({
  reviews: [],
  isLoading: false,
  canReview: false,

  fetchReviews: async (productId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/reviews/product/${productId}`);
      set({ reviews: response.data.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching reviews:", error);
      set({ isLoading: false });
    }
  },

  checkCanReview: async (productId) => {
    try {
      const response = await axiosInstance.get(
        `/reviews/check-can-review/${productId}`,
      );
      set({ canReview: response.data.data.canReview });
    } catch (error) {
      set({ canReview: false });
    }
  },

  addReview: async (productId, rating, comment) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/reviews", {
        productId,
        rating,
        comment,
      });
      toast.success("Review submitted successfully!");
      set((state) => ({
        reviews: [response.data.data, ...state.reviews],
        isLoading: false,
        canReview: false, // User can't review again
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
      set({ isLoading: false });
    }
  },
}));

export default useReviewStore;
