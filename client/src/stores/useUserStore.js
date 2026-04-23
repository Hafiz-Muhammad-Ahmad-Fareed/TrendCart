import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const useUserStore = create((set) => ({
  user: null,
  isLoading: false,
  hasFetched: false,

  fetchUser: async () => {
    set({ isLoading: true });

    try {
      const res = await axiosInstance.get("/auth/me");

      if (res.data?.user) {
        set({ user: res.data.user, hasFetched: true });
      } else {
        set({ user: null, hasFetched: true });
      }
    } catch (err) {
      set({ user: null, hasFetched: true });
    } finally {
      set({ isLoading: false });
    }
  },

  resetUser: () =>
    set({
      user: null,
      isLoading: false,
      hasFetched: false,
    }),
}));

export default useUserStore;
