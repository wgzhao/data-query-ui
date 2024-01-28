import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

const get = (url, params) => {
  return axios.get(url, { params })
}

const  post = (url, data) => {
  return axios.post(url, data)
}

export default {get, post}