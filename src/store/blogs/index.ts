import toast from "react-hot-toast";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import axiosInstance from "@/utils/axios";
import { HOST_API } from "@/config";
import { Blog, ApprovedBlogWithDomain } from "./blog.types";
import useAuthStore from "@/store/auth";

type BlogStateType = {
  blogs: Blog[];
  currentBlog: Blog | null;
  approvedBlogsWithDomains: ApprovedBlogWithDomain[];
  loading: boolean;
  addingTopics: boolean;
  generatingBlogs: boolean;
  error: string;
};

type BlogActionsType = {
  fetchPendingBlogs: () => Promise<void>;
  fetchBlogById: (id: string) => Promise<void>;
  fetchApprovedBlogsWithDomains: () => Promise<void>;
  approveBlog: (id: string) => Promise<void>;
  rejectBlog: (id: string) => Promise<void>;
  addTopics: () => Promise<void>;
  generateBlogs: () => Promise<void>;
  clearError: () => void;
  clearCurrentBlog: () => void;
};

const useBlogStore = create<BlogStateType & BlogActionsType>()(
  immer((set, get) => ({
    blogs: [],
    currentBlog: null,
    approvedBlogsWithDomains: [],
    loading: false,
    addingTopics: false,
    generatingBlogs: false,
    error: "",

    fetchPendingBlogs: async () => {
      try {
        set({ loading: true, error: "" });
        const res = await axiosInstance.get<Blog[]>(`/api/blogs/admin/pending-blogs`);
        set({ blogs: res.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
        toast.error(error.message);
      }
    },

    fetchApprovedBlogsWithDomains: async () => {
      try {
        set({ loading: true, error: "" });
        const res = await axiosInstance.get<ApprovedBlogWithDomain[]>(`/api/blogs/approved/with-domains`);
        set({ approvedBlogsWithDomains: res.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
        toast.error(error.message);
      }
    },

    fetchBlogById: async (id: string) => {
      try {
        set({ loading: true, error: "" });
        const res = await axiosInstance.get<Blog>(`/api/blogs/${id}`);
        set({ currentBlog: res.data, loading: false });
      } catch (error) {
        set({ error: error.message, loading: false });
        toast.error(error.message);
      }
    },

    approveBlog: async (id: string) => {
      try {
        console.log("Approving blog with ID:", id);
        
        // Get the current user's username from auth store
        const { user } = useAuthStore.getState();
        if (!user || !user.username) {
          throw new Error("User not authenticated or username not available");
        }
        
        const res = await axiosInstance.post(`/api/blogs/admin/pending-blogs/approve`, {
          blogId: id,
          username: user.username
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
        const res = await axiosInstance.post(`/api/blogs/admin/pending-blogs/reject`, {
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

    addTopics: async () => {
      try {
        set({ addingTopics: true, error: "" });
        const res = await axiosInstance.post(`/api/topics/add-topic`);
        toast.success("Topics added successfully!");
        set({ addingTopics: false });
      } catch (error) {
        set({ error: error.message, addingTopics: false });
        toast.error(error.message);
      }
    },

    generateBlogs: async () => {
      try {
        set({ generatingBlogs: true, error: "" });
        let totalBlogsGenerated = 0;
        let hasMoreTopics = true;
        
        while (hasMoreTopics) {
          const res = await axiosInstance.post(`/api/blogs/add-blog`);
          
          // Check if the response indicates no more topics
          if (res.data && typeof res.data === 'object' && 'message' in res.data) {
            if (res.data.message.includes('No unassigned topics available')) {
              hasMoreTopics = false;
              if (totalBlogsGenerated > 0) {
                toast.success(`Blog generation completed! Generated ${totalBlogsGenerated} blogs.`);
              } else {
                toast("No unassigned topics available for blog generation.");
              }
            } else {
              // Some other message, treat as error
              throw new Error(res.data.message);
            }
          } else if (Array.isArray(res.data)) {
            // Successfully generated blogs
            totalBlogsGenerated += res.data.length;
            toast.success(`Generated ${res.data.length} blogs! Total: ${totalBlogsGenerated}`);
          } else {
            // Unexpected response format
            throw new Error("Unexpected response format from blog generation");
          }
        }
        
        set({ generatingBlogs: false });
      } catch (error) {
        set({ error: error.message, generatingBlogs: false });
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
