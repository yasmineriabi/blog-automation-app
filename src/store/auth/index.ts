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

        const token =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");

        if (token && isValidToken(token)) {
          const persistent = Boolean(localStorage.getItem("accessToken"));
          setSession(token, persistent);

          const { user } = jwtDecode(token);
          const res = await axiosInstance.get<IUser>(
            `${HOST_API}/users/${user}`,
          );

          set({
            user: res.data,
            loading: false,
            authenticated: true,
          });
        } else {
          get().handleSessionReset();
        }
      } catch (error) {
        console.error("Initialization Error:", error);
        toast.error(error.message || "An unexpected error occurred.");
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
        const { rememberMe, ...other } = body;
        const res = await axiosInstance.post<{ token: string }>(
          `${HOST_API}/auth/login`,
          other,
        
        );
        if (res.data) {
          const { token } = res.data;
          setSession(token, rememberMe);
          await get().initialize();
        }
      } catch (error) {
        toast.error(error?.message);
        set({ user: null, loading: false, authenticated: false });
      }
    },

    OAuthlogin: async (verifyToken) => {
      try {
        const res = await axiosInstance.post<{ token: string }>(
          `${HOST_API}/auth/oauth-login`,
          { token: verifyToken },
         
        );
        const { token } = res.data;
        setSession(token, true);
        await get().initialize();
      } catch (error) {
        toast.error(error?.message);
        set({ user: null, loading: false, authenticated: false });
        throw error;
      }
    },
    register: async (data) => {
      try {
        const { email, password } = data;
        const res = await axiosInstance.post<{ message: string }>(
          `${HOST_API}/auth/register`,
          data,
         
        );
        if (res?.data?.message) {
          await get().login({ email, password, rememberMe: false });
        }
      } catch (error) {
        console.warn(error);
        toast.error(error.message);
        set({ user: null, loading: false, authenticated: false });

        throw new Error(error.message);
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
          `${HOST_API}/users/${id}`,
          updatedData,
        );
        const accessToken =
          localStorage.getItem("accessToken") ||
          sessionStorage.getItem("accessToken");

        if (res.data && accessToken) {
          set({ user: res.data, uppdateLoader: false });
        }
      } catch (error) {
        toast.error(error.message);
        set({ uppdateLoader: false });
      }
    },

    forgotPassword: async (email) => {
      try {
        const res = await axiosInstance.post(
          `${HOST_API}/email/password/reset`,
          {
            email: email.toLowerCase(),
          },
         
        );
        toast.success(res.data.message);
      } catch (error) {
        toast.error(error.message);

        throw error;
      }
    },

    resetPassword: async (token, password) => {
      try {
        await axiosInstance.post(
          `${HOST_API}/users/reset-password`,
          {
            token,
            password,
          },
         
        );
      } catch (error) {
        toast.error(error.message);
        throw error;
      }
    },
    sendVerificationMail: async (mail) => {
      try {
        const res = await axiosInstance.post(`${HOST_API}/email/verify`, {
          email: mail,
        });
        toast.success(res.data.message);
      } catch (error) {
        toast.error(error.message);
        throw error;
      }
    },
    verifyEmail: async (body) => {
      try {
        const res = await axiosInstance.post<{ isVerified: boolean }>(
          `${HOST_API}/users/verify-email`,
          body,
        );
        set((state) => ({
          user: {
            ...state.user,
            isVerified: res.data.isVerified,
          },
        }));
      } catch (error) {
        toast.error(error.messag);
        throw error;
      }
    },
  })),
);

export default useAuthStore;