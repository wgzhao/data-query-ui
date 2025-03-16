import {ref} from "vue";
import { Sign, QueryConfig } from "@/types";
import Request from "@/util/request";

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

  update(appId: string, item: Sign) {
    return Request.put(`${baseURL}/${appId}`, item);
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

   getAllQueryConfigs()  {
    return Request.get(`${baseURL}/query-configs`);
  }

  getSignQueryRelations(appId: string) {
    return Request.get(`${baseURL}/query-configs/${appId}`);
  }

  updateSignQueryRelations(appId: string, queryConfigIds: string[]) {
    return Request.put(`${baseURL}/query-configs/${appId}`, { queryConfigIds });
  }
}

export default new SignService();
