import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/constants/constants";
import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

type User = {
  user_id: number;
  username: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    first_name?: string;
    last_name?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Helper to store token
  const setToken = (token: string) => {
    localStorage.setItem("auth_token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE_URL}/api/user`, { withCredentials: true });
        setUser(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setUser(null);
          localStorage.removeItem("auth_token");
          delete axios.defaults.headers.common["Authorization"];
          setError(err);
        } else {
          setError(err);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Login
  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/login`, credentials, { withCredentials: true });
      if (res.data.token) setToken(res.data.token);
      setUser(res.data.user || res.data);
      toast({ title: "Login successful", description: `Welcome back, ${res.data.user?.username || res.data.username}!` });
    } catch (err: any) {
      setError(err);
      toast({ title: "Login failed", description: err.response?.data?.message || "Invalid email or password", variant: "destructive" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    first_name?: string;
    last_name?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/register`, userData, { withCredentials: true });
      if (res.data.token) setToken(res.data.token);
      setUser(res.data.user || res.data);
      toast({ title: "Registration successful", description: `Welcome, ${res.data.user?.username || res.data.username}!` });
    } catch (err: any) {
      setError(err);
      toast({ title: "Registration failed", description: err.response?.data?.message || "Registration failed", variant: "destructive" });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    console.log("AuthContext: logout() called");
    setIsLoading(true);
    setError(null);
    let serverLogoutFailed = false;
    let apiError: any = null; // To store error from catch block for finally
    let tokenUsedInApiCall = false;

    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        tokenUsedInApiCall = true;
        console.log("AuthContext: Token found. Attempting API call to /api/logout...");
        await axios.post(`${API_BASE_URL}/api/logout`, {}, {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true
        });
        console.log("AuthContext: API call to /api/logout successful.");
        toast({ title: "Logout Successful", description: "Successfully logged out from server." });
      } else {
        console.log("AuthContext: No token found. Skipping API logout call.");
        // No API call made, so no server error, but client will be logged out.
        // A toast for "logged out locally" will be handled in finally.
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        serverLogoutFailed = false;
        toast({ title: "Logged Out", description: "You were already logged out." });
      } else {
        console.error("AuthContext: API call to /api/logout failed:", err);
        serverLogoutFailed = true;
        apiError = err;
        setError(err);
      }
    } finally {
      console.log("AuthContext: Performing client-side cleanup...");
      localStorage.removeItem("auth_token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      console.log("AuthContext: Client-side state cleared.");

      if (serverLogoutFailed) {
        toast({
          title: "Server Logout Failed",
          description: "You are logged out locally. " + (apiError?.response?.data?.message || "Could not notify server."),
          variant: "destructive"
        });
      } else if (!tokenUsedInApiCall) {
        // If no token was found initially, and thus no API call was made
        toast({ title: "Logged Out", description: "You have been logged out locally." });
      }
      // If tokenUsedInApiCall was true and serverLogoutFailed is false, success toast was already shown in try.

      console.log("AuthContext: logout() finished.");
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
