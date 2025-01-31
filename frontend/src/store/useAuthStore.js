import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,

    signup: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password });
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.error || "Signup failed" };
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            set({ user, isAuthenticated: true });
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.error || "Login failed" };
        } finally {
            set({ isLoading: false });
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ user: null, isAuthenticated: false });
    },

    verify: async () => {
        set({ isLoading: true });
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                set({ user: null, isAuthenticated: false });
                return { success: false, message: "No token found" };
            }

            const response = await axios.get(`${API_URL}/verify`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                set({ user: response.data.user, isAuthenticated: true });
                return { success: true };
            } else {
                set({ user: null, isAuthenticated: false });
                return { success: false, message: response.data.message };
            }
        } catch (error) {
            set({ user: null, isAuthenticated: false });
            return { success: false, message: error.response?.data?.error || "Verification failed" };
        } finally {
            set({ isLoading: false });
        }
    }
}));

export default useAuthStore;
