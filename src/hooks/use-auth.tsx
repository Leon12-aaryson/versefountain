import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, getQueryFn, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/constants/constants";
import axios from "axios";

// Add this interceptor ONCE, outside the component
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
  role: string; // e.g., 'user', 'admin'
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  logoutMutation: any;
  loginMutation: any;
  registerMutation: any;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [tokenReady, setTokenReady] = useState(false);

  // Helper to store token
  const setToken = (token: string) => {
    localStorage.setItem("auth_token", token);
    // No need to set axios.defaults.headers here anymore
  };

  // On mount, check for token in localStorage and set tokenReady
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Optionally, set axios header here if not already set by interceptor
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setTokenReady(true);
  }, []);

  // Query to get user data from backend
  const { data: user, isLoading, error } = useQuery<User | null, Error>({
    queryKey: ['/api/user'],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 300000,
    retry: false,
    enabled: tokenReady, // Only run query after token is set
  });

  // Login
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest("POST", `${API_BASE_URL}/api/login`, credentials);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.token) setToken(data.token);
      queryClient.setQueryData(['/api/user'], data.user || data);
      toast({ title: "Login successful", description: `Welcome back, ${data.user?.username || data.username}!` });
    },
    onError: (error: any) => {
      toast({ title: "Login failed", description: error.data?.message || error.statusText || "Invalid email or password", variant: "destructive" });
    },
  });

  // Register
  const registerMutation = useMutation({
    mutationFn: async (userData: any) => {
      const response = await apiRequest("POST", `${API_BASE_URL}/api/register`, userData);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.token) setToken(data.token);
      queryClient.setQueryData(['/api/user'], data.user || data);
      toast({ title: "Registration successful", description: `Welcome, ${data.user?.username || data.username}!` });
    },
    onError: (error: any) => {
      toast({ title: "Registration failed", description: error.data?.message || "Registration failed", variant: "destructive" });
    },
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `${API_BASE_URL}/api/logout`);
    },
    onSuccess: () => {
      localStorage.removeItem("auth_token");
      delete axios.defaults.headers.common["Authorization"];
      queryClient.setQueryData(['/api/user'], null);
      toast({ title: "Logout successful", description: "You have been logged out" });
    },
    onError: (error: any) => {
      toast({ title: "Logout failed", description: error.data?.message || "Logout failed", variant: "destructive" });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        logoutMutation,
        loginMutation,
        registerMutation,
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
