import axios from 'axios'

const  user = JSON.parse(localStorage.getItem('user'));

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTcwNjYwMDg4NiwiZXhwIjoxNzA2Njg3Mjg2fQ.OWYNsv4lLAR7HLi1U8xKLh0T2ZMAU1OYnagltMEE_K4",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  },
  withCredentials: false
});


class Request {
  // get(url, params) {
  //   return axios.get(url, {params}, config)
  // }

  get(url, params) {
    return axiosInstance({method: 'get', url: url, params: params})
  }

  post(url, data) {
    return axios.post(url, data, headers=headers)
  }

  delete(url, params) {
    return axios.delete(url, { params }, headers=headers)
  }

}
export default new Request();
