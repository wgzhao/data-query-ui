import { ref } from "vue";

import Request from "@/utils/request";
import Sign from "@/types/sign-type";

const baseURL = "/sign";

class SignService {
  list() {
    return Request.get(baseURL);
  }

  get(id: string) {
    return Request.get(`${baseURL}/${id}`);
  }

  save(item: Sign) {
    return Request.post(`${baseURL}`, item);
  }

  update(item: Sign) {
    return Request.put(`${baseURL}`, item);
  }

  remove(id: string) {
    return Request.delete(`${baseURL}/${id}`);
  }

  exists(id: string) {
    const flag = ref(false);
    Request.get(`${baseURL}/checkNo/${id}`)
      .then(res => (flag.value = res.data))
      .catch(err => console.log(err));
    return flag;
  }

  gen() {
    return Request.get(`${baseURL}/gen`);
  }
}

export default new SignService();
