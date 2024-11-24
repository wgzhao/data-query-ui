import axios from "axios";
import { router } from "@/plugins/router";
import { useAuthStore } from "@/store";
const authStore = useAuthStore();

const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000
});

// request interceptor
service.interceptors.request.use(
  config => {
    if (authStore.token) {
      config.headers["Authorization"] = `Bearer ${authStore.token}`;
    }
    return config;
  },
  error => {
    console.log("Request Error:", error);
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    console.log("resp interceptor", response.status);
    if (response.status === 401) {
      router.push("/login");
    }
    if (response.staus === 403) {
      alert("You don't have permission to access this page");
      return Promise.reject(error);
    }
    return response.data;
  },
  error => {
    if (error.status == 401) {
      router.push("/login");
    }
    alert("Server error: " + error.status);
    console.log("Response Error: ", error);
    return Promise.reject(error);
  }
);

class Request {
  get(url: string, params?: any) {
    return service.get(url, { params: params });
  }

  post(url: string, data) {
    return service.post(url, data);
  }

  delete(url: string, params?: any) {
    return service.delete(url, { params });
  }

  put(url: string, data) {
    return service.put(url, data);
  }
}
export default new Request();
