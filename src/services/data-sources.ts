import Request from "@/util/request";
import type { DataSource } from "@/types";

class DataSourcesService {
  prefix = "/data-sources";
  list() {
    return Request.get(this.prefix);
  }

  get(id: string) {
    console.log("invoke get with id: " + id);
    return Request.get(`${this.prefix}/${id}`);
  }

  testConnection(item: DataSource) {
    return Request.post(`${this.prefix}/test-connection`, item);
  }

  save(item: DataSource) {
    return Request.post(`${this.prefix}`, item);
  }

  remove(id: string) {
    return Request.delete(`${this.prefix}/${id}`);
  }

  exists(id: string): boolean {
    Request.get(`${this.prefix}/${id}`)
      .then(res => {
        return res != null && res != "";
      })
      .catch(err => console.log(err));
    return false;
  }
}

export default new DataSourcesService();
