import { ref } from "vue";

import Request from "@/util/request";
import type {DataSource} from "@/types";
const baseURL = "/data-sources";

class DataSourcesService {
  list() {
    return Request.get(baseURL);
  }

  get(id: string) {
    console.log("invoke get with id: " + id);
    return Request.get(`${baseURL}/${id}`);
  }

  testConnection(item: DataSource) {
    return Request.post(`${baseURL}/test-connection`, item);
  }

  save(item: DataSource) {
    return Request.post(`${baseURL}`, item);
  }

  remove(id: string) {
    return Request.delete(`${baseURL}/${id}`);
  }

  exists(id: string): boolean {
    const flag = ref(false);
    Request.get(`${baseURL}/${id}`)
      .then(res => {
        flag.value = res != null || res != "";
      })
      .catch(err => console.log(err));
    return flag.value;
  }
}

export default new DataSourcesService();
