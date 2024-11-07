import { ref } from "vue";

import Request from "@/util/request";
import DataSource from "@/types/data-source";
const baseURL = "/dataSource";

class DataSourcesService {
  list() {
    return Request.get(baseURL);
  }

  get(id: string) {
    console.log("invoke get with id: " + id);
    return Request.get(`${baseURL}/${id}`);
  }

  testConnection(item: DataSource) {
    return Request.post(`${baseURL}/testConnection`, item);
  }

  save(item: DataSource) {
    return Request.post(`${baseURL}`, item);
  }

  remove(id: string) {
    return Request.delete(`${baseURL}/${id}`);
  }

  exists(id: string) {
    const flag = ref(false);
    Request.get(`${baseURL}/${id}`)
      .then(res => {
        console.log(res.data['no']);
        flag.value = res.data['no'] == id;
      }
      )
      .catch(err => console.log(err));
    return flag;
  }
}

export default new DataSourcesService();
