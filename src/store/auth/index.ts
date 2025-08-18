import toast from "react-hot-toast";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import axiosInstance from "@/utils/axios";
import { isValidToken, jwtDecode, setSession } from "@/utils/jwt";
import {  HOST_API } from "@/config";
import { IUser } from "./user.types";

type AuthStateType = {
  user: IUser | null;
  loading: boolean;
  authenticated: boolean;
  uppdateLoader: boolean;
};
interface IUpdatedUser extends Partial<Omit<IUser, "createdAt" | "updatedAt">> {
  oldPassword?: string;
  newPassword?: string;
}
interface IRegister {
  email: string;
  password: string;
  username: string;
}
interface ILogin {
  email: string;
  password: string;
  rememberMe: boolean;
}
type AuthActionsType = {
  initialize: () => Promise<void>;
  login: (body: ILogin) => Promise<void>;
  OAuthlogin: (token: string) => Promise<void>;
  register: (body: IRegister) => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: IUpdatedUser, id: string) => Promise<void>;
  updateUsername: (userId: string, username: string) => Promise<void>;
  updatePassword: (userId: string, oldPassword: string, newPassword: string) => Promise<void>;
  uploadProfilePicture: (userId: string, file: File) => Promise<void>;

  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  handleSessionReset: (msg?: string) => void;
  sendVerificationMail: (mail: string) => Promise<void>;
  verifyEmail: (body: { code: string; email: string }) => Promise<void>;
};

const useAuthStore = create<AuthStateType & AuthActionsType>()(
  immer((set, get) => ({
    user: null,
    loading: true,
    authenticated: false,
    uppdateLoader: false,

    initialize: async () => {
      try {
        set({ loading: true });

        // Check if we're in browser environment
        if (typeof window === 'undefined') {
          set({ loading: false, authenticated: false });
          return;
        }

        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");

        if (token && isValidToken(token)) {
          const persistent = Boolean(localStorage.getItem("accessToken"));
          setSession(token, persistent);

          const decoded = jwtDecode(token);
          if (decoded && decoded.user) {
            const res = await axiosInstance.get<IUser>(
              `/api/users/${decoded.user}`,
            );

            set({
              user: res.data,
              loading: false,
              authenticated: true,
            });
          } else {
            get().handleSessionReset();
          }
        } else {
          get().handleSessionReset();
        }
      } catch (error) {
        console.error("Initialization Error:", error);
        const errorMessage = error?.message || "An unexpected error occurred.";
        toast.error(errorMessage);
        get().handleSessionReset();
      } finally {
        set({ loading: false });
      }
    },
    handleSessionReset: (message?: string) => {
      setSession(null, false);
      set({ user: null, loading: false, authenticated: false });
      if (message) {
        toast.error(message);
      }
    },
    login: async (body) => {
      try {
        set({ loading: true });
        const { rememberMe, ...other } = body;
        const res = await axiosInstance.post<{ token: string }>(
          `/api/auth/login`,
          other,
        
        );
        if (res.data) {
          const { token } = res.data;
          setSession(token, rememberMe);
          await get().initialize();
        }
      } catch (error) {
        const errorMessage = error?.message || 'Login failed';
        toast.error(errorMessage);
        set({ user: null, loading: false, authenticated: false });
      }
    },

    OAuthlogin: async (verifyToken) => {
      try {
        const res = await axiosInstance.post<{ token: string }>(
          `/api/auth/oauth-login`,
          { token: verifyToken },
         
        );
        const { token } = res.data;
        setSession(token, true);
        await get().initialize();
      } catch (error) {
        const errorMessage = error?.message || 'OAuth login failed';
        toast.error(errorMessage);
        set({ user: null, loading: false, authenticated: false });
        throw error;
      }
    },
    register: async (data) => {
      try {
        const { email, password } = data;
        const res = await axiosInstance.post<{ message: string }>(
          `/api/auth/signup`,
          data,
         
        );
        if (res?.data?.message) {
          await get().login({ email, password, rememberMe: false });
        }
      } catch (error) {
        console.warn(error);
        const errorMessage = error?.message || 'Registration failed';
        toast.error(errorMessage);
        set({ user: null, loading: false, authenticated: false });

        throw new Error(errorMessage);
      }
    },

    logout: () => {
      setSession(null, false);
      set({ user: null, authenticated: false });
    },

    updateUser: async (updatedData, id: string) => {
      set({ uppdateLoader: true });
      try {
        const res = await axiosInstance.put<IUser>(
          `/api/users/${id}`,
          updatedData,
        );
        const accessToken =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");

        if (res.data && accessToken) {
          set({ user: res.data, uppdateLoader: false });
        }
      } catch (error) {
        const errorMessage = error?.message || 'Update failed';
        toast.error(errorMessage);
        set({ uppdateLoader: false });
      }
    },

    updateUsername: async (userId: string, username: string) => {
      set({ uppdateLoader: true });
      try {
        const res = await axiosInstance.put<{ message: string }>(
          `/api/users/update-username`,
          { userId, username },
        );
        
        if (res.data) {
          // Update the user state with new username
          set((state) => ({
            user: state.user ? { ...state.user, username } : null,
            uppdateLoader: false,
          }));
          toast.success(res.data.message);
        }
      } catch (error) {
        const errorMessage = error?.message || 'Username update failed';
        toast.error(errorMessage);
        set({ uppdateLoader: false });
        throw error;
      }
    },

    updatePassword: async (userId: string, oldPassword: string, newPassword: string) => {
      set({ uppdateLoader: true });
      try {
        const res = await axiosInstance.put<{ message: string }>(
          `/api/users/update-password`,
          { userId, oldPassword, newPassword },
        );
        
        if (res.data) {
          set({ uppdateLoader: false });
          toast.success(res.data.message);
        }
      } catch (error) {
        const errorMessage = error?.message || 'Password update failed';
        toast.error(errorMessage);
        set({ uppdateLoader: false });
        throw error;
      }
    },

    uploadProfilePicture: async (userId: string, file: File) => {
      set({ uppdateLoader: true });
      try {
        const formData = new FormData();
        formData.append('profilePicture', file);
        formData.append('userId', userId);

        const res = await axiosInstance.post<{ message: string; avatarUrl: string }>(
          `/api/users/upload-profile-picture`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        if (res.data) {
          // Update the user state with new profile picture
          set((state) => ({
            user: state.user ? { ...state.user, profilePicture: res.data.avatarUrl } : null,
            uppdateLoader: false,
          }));
          toast.success(res.data.message);
        }
      } catch (error) {
        const errorMessage = error?.message || 'Profile picture upload failed';
        toast.error(errorMessage);
        set({ uppdateLoader: false });
        throw error;
      }
    },

    forgotPassword: async (email) => {
      try {
        const res = await axiosInstance.post(
          `/api/email/password/reset`,
          {
            email: email.toLowerCase(),
          },
         
        );
        toast.success(res.data.message);
      } catch (error) {
        const errorMessage = error?.message || 'Password reset failed';
        toast.error(errorMessage);

        throw error;
      }
    },

    resetPassword: async (token, password) => {
      try {
        await axiosInstance.post(
          `/api/users/reset-password`,
          {
            token,
            password,
          },
         
        );
      } catch (error) {
        const errorMessage = error?.message || 'Password reset failed';
        toast.error(errorMessage);
        throw error;
      }
    },
    sendVerificationMail: async (mail) => {
      try {
        const res = await axiosInstance.post(`/api/email/verify`, {
          email: mail,
        });
        toast.success(res.data.message);
      } catch (error) {
        const errorMessage = error?.message || 'Email verification failed';
        toast.error(errorMessage);
        throw error;
      }
    },
    verifyEmail: async (body) => {
      try {
        const res = await axiosInstance.post<{ isVerified: boolean }>(
          `/api/users/verify-email`,
          body,
        );
        set((state) => ({
          user: {
            ...state.user,
            isVerified: res.data.isVerified,
          },
        }));
      } catch (error) {
        const errorMessage = error?.message || 'Email verification failed';
        toast.error(errorMessage);
        throw error;
      }
    },
  })),
);

export default useAuthStore;