import axios from "axios";
import router from "@/router";
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
console.log("mode = " + import.meta.env.MODE);
const token = localStorage.getItem("token");
if (token !== null) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    // if (error.response.status === 401) {
    //   const url = new URL(location.href);
    //   console.log("401 : " + url.pathname);
    //   router.push("/login", params => {
    //     path: url.pathname;
    //   });
    // }
    return Promise.reject(error);
  }
);

class Request {
  get(url: string, params?: any) {
    return axios.get(url, { params: params });
  }

  post(url: string, data) {
    return axios.post(url, data);
  }

  delete(url: string, params?: any) {
    return axios.delete(url, { params });
  }

  put(url: string, data) {
    return axios.put(url, data);
  }
}
export default new Request();
