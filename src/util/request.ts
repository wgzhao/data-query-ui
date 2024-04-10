import axios from 'axios'
import router from '@/router';
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
console.log("mode = " + import.meta.env.MODE)
const token = localStorage.getItem('token');
if (token !== null) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
  // not logged int , redirect login page
  router.push('/login');
}

axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response.status === 401) {
    router.push('/login')
  }
  return Promise.reject(error)
})

class Request {
  get(url: string, params) {
    return axios.get(url, {params: params} )
  }

  post(url: string, data) {
    return axios.post(url, data)
  }

  delete(url: string, params) {
    return axios.delete(url, { params })
  }

  put(url: string, data) {
    return axios.put(url, data)
  }

}
export default new Request();
