import {ref} from 'vue'

import Request from '@/util/request'
const baseURL = ref("/dataSource")
class DataSourcesService {

  list() {
    return Request.get(baseURL.value)
  }

  get(id) {
    console.log("invoke get with id: " + id);
    return Request.get(`${baseURL.value}/${id}`)
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
}

export default new DataSourcesService();
