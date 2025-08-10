import toast from "react-hot-toast";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axiosInstance from "@/utils/axios";
import { HOST_API } from "@/config";
import { Blog, ApprovedBlogWithDomain } from "./blog.types";

type BlogStateType = {
  blogs: Blog[];
  currentBlog: Blog | null;
  approvedBlogsWithDomains: ApprovedBlogWithDomain[];
  loading: boolean;
  error: string;
};

type BlogActionsType = {
  fetchPendingBlogs: () => Promise<void>;
  fetchBlogById: (id: string) => Promise<void>;
  fetchApprovedBlogsWithDomains: () => Promise<void>;
  approveBlog: (id: string) => Promise<void>;
  rejectBlog: (id: string) => Promise<void>;
  clearError: () => void;
  clearCurrentBlog: () => void;
};

const useBlogStore = create<BlogStateType & BlogActionsType>()(
  immer((set, get) => ({
    blogs: [],
    currentBlog: null,
    approvedBlogsWithDomains: [],
    loading: false,
    error: "",

    fetchPendingBlogs: async () => {
      try {
        set({ loading: true, error: "" });
        const res = await axiosInstance.get<Blog[]>(`${HOST_API}/blogs/admin/pending-blogs`);
        set({ blogs: res.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
        toast.error(error.message);
      }
    },

    fetchApprovedBlogsWithDomains: async () => {
      try {
        set({ loading: true, error: "" });
        const res = await axiosInstance.get<ApprovedBlogWithDomain[]>(`${HOST_API}/blogs/approved/with-domains`);
        set({ approvedBlogsWithDomains: res.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
        toast.error(error.message);
      }
    },

    fetchBlogById: async (id: string) => {
      try {
        set({ loading: true, error: "" });
        const res = await axiosInstance.get<Blog>(`${HOST_API}/blogs/${id}`);
        set({ currentBlog: res.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
        toast.error(error.message);
      }
    },

    approveBlog: async (id: string) => {
      try {
        console.log("Approving blog with ID:", id);
        const res = await axiosInstance.post(`${HOST_API}/blogs/admin/pending-blogs/approve`, {
          blogId: id
        });
        set((state) => {
          state.blogs = state.blogs.filter((blog) => blog._id !== id);
        });
        toast.success("Blog approved successfully");
      } catch (error) {
        toast.error(error.message);
      }
    },

    rejectBlog: async (id: string) => {
      try {
        console.log("Rejecting blog with ID:", id);
        const res = await axiosInstance.post(`${HOST_API}/blogs/admin/pending-blogs/reject`, {
          blogId: id
        });
        set((state) => {
          state.blogs = state.blogs.filter((blog) => blog._id !== id);
        });
        toast.success("Blog rejected successfully");
      } catch (error) {
        toast.error(error.message);
      }
    },

    clearError: () => {
      set({ error: "" });
    },

    clearCurrentBlog: () => {
      set({ currentBlog: null });
    },
  }))
);

export default useBlogStore; 