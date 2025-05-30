// This file previously set up @tanstack/react-query's QueryClient.
// Now, we use only axios and utility functions for API requests.

import axios, { AxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/constants/constants";

// Helper to throw if response is not OK (for fetch, if you still use it elsewhere)
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Generic API request using axios
export async function apiRequest<T = any>(
  method: AxiosRequestConfig["method"],
  url: string,
  data?: unknown,
  config?: Omit<AxiosRequestConfig, "method" | "url" | "data">
): Promise<T> {
  try {
    const response = await axios({
      method,
      url: url.startsWith("http") ? url : `${API_BASE_URL}${url}`,
      data,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
      ...config,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) throw error.response;
    throw error;
  }
}

// Example: fetch data (GET)
export async function fetchData<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>("get", endpoint, undefined, config);
}

// Example: post data (POST)
export async function postData<T = any>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>("post", endpoint, data, config);
}

// Example: update data (PATCH/PUT)
export async function updateData<T = any>(endpoint: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>("patch", endpoint, data, config);
}

// Example: delete data (DELETE)
export async function deleteData<T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
  return apiRequest<T>("delete", endpoint, undefined, config);
}

// If you need to handle 401s gracefully, wrap your calls in try/catch in your components or hooks.
