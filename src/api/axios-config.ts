import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// const baseURL ='http://localhost:3003';
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://quang1709.ddns.net:3003'

const axiosInstance = axios.create({
  baseURL,
  // Do not set Content-Type here so Axios can determine it from the request data
})

// Request interceptor: Add token vào header nếu có
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Only add Content-Type: application/json when the data is not FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// // Response interceptor: Return response data directly and handle 401 errors
// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse) => response.data,
//   (error: AxiosError) => {
//     if (error.response?.status === 401) {
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
