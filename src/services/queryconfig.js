import {ref} from 'vue'

import Request from '@/util/request'
const baseURL = ref("/queryconfig")
class QueryconfigService {

  list() {
    return Request.get(baseURL.value)
  }

  get(id) {
    console.log("invoke get with id: " + id);
    return Request.get(`${baseURL.value}/${id}`)
  }

  getDbSources() {
    return Request.get(`${baseURL.value}/datasources`)
  }

  testConnection(item) {
    return Request.post(`${baseURL.value}/testConnection`, item)
  }

  save(item) {
    return Request.post(`${baseURL.value}`, item)
  }

  remove(id) {
    return Request.delete(`${baseURL.value}/${id}`)
  }

  exists(id) {
    const flag = ref(false)
    Request.get(`${baseURL.value}/checkNo/${id}`)
      .then(res => flag.value = res.data)
      .catch(err => console.log(err))
    return flag;
  }

  getParams(id) {
    return Request.get(`${baseURL.value}/params/${id}`)
  }

  saveParams(params) {
    return Request.put(`${baseURL.value}/params`, params)
  }

}

export default new QueryconfigService();
