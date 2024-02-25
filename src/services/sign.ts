import {ref} from 'vue'

import Request from '@/util/request'
const baseURL = ref("/sign")

class SignService {

    list() {
      return Request.get(baseURL.value)
    }

    get(id) {
      console.log("invoke get with id: " + id);
      return Request.get(`${baseURL.value}/${id}`)
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

    gen() {
      return Request.get(`${baseURL.value}/gen`)
    }
}

export default new SignService();
