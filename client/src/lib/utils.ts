import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface ApiRequestInit extends RequestInit {
  params?: Record<string, string>;
}

export async function apiRequest<T = any>(
  path: string,
  options: ApiRequestInit = {}
): Promise<T> {
  const { params, ...init } = options;
  
  let url = path;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    url += `?${searchParams.toString()}`;
  }
  
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...init,
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API request failed with status ${response.status}`);
  }
  
  // Handle empty responses (like for DELETE requests)
  const text = await response.text();
  return text ? JSON.parse(text) : undefined;
}
