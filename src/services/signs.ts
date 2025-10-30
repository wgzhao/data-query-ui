import { ref } from "vue";
import { Sign } from "@/types";
import Request from "@/util/request";

class SignService {
  prefix = "/signs";
  list() {
    return Request.get(this.prefix);
  }

  get(id: string) {
    return Request.get(`${this.prefix}/${id}`);
  }

  save(item: Sign) {
    return Request.post(`${this.prefix}`, item);
  }

  update(appId: string, item: Sign) {
    return Request.put(`${this.prefix}/${appId}`, item);
  }

  remove(id: string) {
    return Request.delete(`${this.prefix}/${id}`);
  }

  exists(id: string) {
    const flag = ref(false);
    Request.get(`${this.prefix}/checkNo/${id}`)
      .then(res => (flag.value = res.data))
      .catch(err => console.log(err));
    return flag;
  }

  gen() {
    return Request.get(`${this.prefix}/gen`);
  }

  getAllQueryConfigs() {
    return Request.get(`${this.prefix}/query-configs`);
  }

  getSignQueryRelations(appId: string) {
    return Request.get(`${this.prefix}/query-configs/${appId}`);
  }

  updateSignQueryRelations(appId: string, queryConfigIds: string[]) {
    return Request.post(
      `${this.prefix}/query-configs/${appId}`,
      queryConfigIds
    );
  }
}

export default new SignService();
