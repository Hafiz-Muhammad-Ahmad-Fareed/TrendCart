import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

const useUserStore = create((set) => ({
  user: null,

  fetchUser: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");

      if (res.data?.user) {
        set({ user: res.data.user });
      } else {
        set({ user: null });
      }
    } catch (err) {
      console.log(err.message);
      set({ user: null });
    }
  },
}));

export default useUserStore;
