import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useAuthStore } from "@/store/auth";

// 控制台输出当前环境模式
console.log(`Current mode: ${import.meta.env.MODE}`);

/**
 * API响应数据的标准格式
 */
interface ResponseData<T = any> {
  code: number;
  message: string;
  result: T;
}

/**
 * HTTP请求工具类
 */
class Request {
  private instance: AxiosInstance;

  constructor(baseURL: string, timeout = 5000) {
    // 创建Axios实例
    this.instance = axios.create({
      baseURL,
      timeout
    });

    // 请求拦截器
    this.instance.interceptors.request.use(
      config => {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      error => Promise.reject(error)
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response.data,
      error => {
        // 处理401认证错误
        if (error.response?.status === 401) {
          const authStore = useAuthStore();
          authStore.logout();
          window.location.href = "/login";
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * GET请求
   * @param url 请求路径
   * @param params 查询参数
   * @param config 额外配置
   */
  get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.get(url, { params, ...config });
  }

  /**
   * POST请求
   * @param url 请求路径
   * @param data 请求体数据
   * @param config 额外配置
   */
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.post(url, data, config);
  }

  /**
   * PUT请求
   * @param url 请求路径
   * @param data 请求体数据
   * @param config 额外配置
   */
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.put(url, data, config);
  }

  /**
   * DELETE请求
   * @param url 请求路径
   * @param config 额外配置
   */
  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ResponseData<T>> {
    return this.instance.delete(url, config);
  }
}

// 导出API请求实例
export default new Request(import.meta.env.VITE_API_BASE_URL);
