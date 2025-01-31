
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = `${import.meta.env.VITE_API_URL}/api/user/data`;

const useDashboardStore = create((set) => ({
  data: [],
  loading: false,
  totalData: 0,
  totalPages: 1,
  currentPage: 1,

  fetchPaginatedData: async (page = 1, limit = 20) => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      set({
        data: response.data.data,
        totalData: response.data.totalData,       
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
        loading: false,
      });
    } catch (error) {
      toast.error("Failed to fetch data");
      set({ loading: false });
    }
  },

  addData: async (newEntry) => {
    set({ loading: true });
    try {
      const response = await axios.post(API_URL, newEntry, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      set((state) => ({ data: [...state.data, response.data.data] }));
      toast.success("User added successfully");
    } catch (error) {
      toast.error("Failed to add user");
    } finally {
      set({ loading: false });
    }
  },

  editData: async (id, updatedEntry) => {
    set({ loading: true });
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedEntry, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      set((state) => ({
        data: state.data.map((item) =>
          item._id === id ? response.data.data : item
        ),
      }));
      toast.success("User updated successfully");
    } catch (error) {
      toast.error("Failed to update user");
    } finally {
      set({ loading: false });
    }
  },

  deleteData: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      set((state) => ({
        data: state.data.filter((item) => item._id !== id),
      }));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      set({ loading: false });
    }
  },
}));

export default useDashboardStore;
