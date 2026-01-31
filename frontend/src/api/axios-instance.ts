import Axios, { AxiosRequestConfig } from 'axios';
export const AXIOS_INSTANCE = Axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL, withCredentials: true });

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export const customInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();

  let headers: {[key:string]: any} = { ...config.headers, ...options?.headers };

  // Server side cookies
  if (typeof window === 'undefined') {
    const { cookies } = await import('next/headers');
    headers.cookie = await cookies();
  }

  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    headers,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-ignore
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};