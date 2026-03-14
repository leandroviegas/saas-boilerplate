import axios from "axios";
import { env } from '@/lib/config';
import { toast } from 'sonner';

export const api = axios.create({
  baseURL: `${env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true
});

api.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    config.headers.cookie = (await cookies()).toString();
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth';
      }
    }

    const message = err.response?.data?.message;
    if (message) {
      toast.error(message.toLowerCase());
    }

    throw err;
  }
);
