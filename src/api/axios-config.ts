import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// const baseURL ='http://localhost:3003';
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://quang1709.ddns.net:3003'

const axiosInstance = axios.create({
  baseURL,
  // Không đặt Content-Type ở đây để cho axios tự xác định dựa trên dữ liệu gửi đi
})

// Request interceptor: Thêm token vào header nếu có
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Chỉ thêm Content-Type: application/json nếu không phải FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// // Response interceptor: Trả về luôn dữ liệu từ response và xử lý lỗi 401
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
