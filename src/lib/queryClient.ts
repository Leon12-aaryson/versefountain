import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getApiBaseUrl } from "./netlifyConfig";
import axios, { AxiosRequestConfig } from "axios";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Get the API base URL based on environment
const apiBase = getApiBaseUrl();

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
) {
  const config: AxiosRequestConfig = {
    method,
    url,
    data,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  };
  try {
    const response = await axios(config);
    return response;
  } catch (error: any) {
    if (error.response) throw error.response;
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Prepend API base URL if queryKey starts with /api
    const url = (queryKey[0] as string).startsWith('/api')
      ? `${apiBase}${(queryKey[0] as string).substring(4)}`
      : queryKey[0] as string;
      
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
