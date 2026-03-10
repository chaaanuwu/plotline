import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null,
  isLoading: true,
  error: null,

  setUser: (userData) =>
    set({
      user: userData,
      isLoading: false,
      error: null,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => set({ error: null }),
}));

export default useUserStore;