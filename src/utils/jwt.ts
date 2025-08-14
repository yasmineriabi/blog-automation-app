import axios from "./axios";

export function jwtDecode(token: string) {
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return null;
    }

    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (_error) {
    // Only remove token and redirect if in browser
    if (typeof window !== 'undefined') {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return null;
  }
}

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return false;
  }

  const decoded = jwtDecode(accessToken);
  if (!decoded) return false;

  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp: number) => {
  // Only run in browser
  if (typeof window === 'undefined') {
    return;
  }

  let expiredTimer: NodeJS.Timeout | null = null;

  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  if (expiredTimer) {
    clearTimeout(expiredTimer);
  }

  expiredTimer = setTimeout(() => {
    alert("Token expired");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = (accessToken: string | null, checked: boolean) => {
  // Only run in browser
  if (typeof window === 'undefined') {
    return;
  }

  if (accessToken) {
    const storage = checked ? localStorage : sessionStorage;
    storage.setItem("accessToken", accessToken);

    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    // This function below will handle when token is expired
    const decoded = jwtDecode(accessToken);
    if (decoded?.exp) {
      tokenExpired(decoded.exp);
    }
  } else {
    localStorage.removeItem("accessToken");
    sessionStorage.removeItem("accessToken");

    delete axios.defaults.headers.common.Authorization;
  }
};
