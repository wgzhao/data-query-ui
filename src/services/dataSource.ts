import { DataSource } from "@/types";
import Request from "@/util/request";

const baseURL = "/data-source";

class DataSourceService {
  list() {
    return Request.get(baseURL);
  }

  get(no: string) {
    return Request.get(`${baseURL}/${no}`);
  }

  save(item: Partial<DataSource>) {
    return Request.post(`${baseURL}`, item);
  }

  update(no: string, item: Partial<DataSource>) {
    return Request.put(`${baseURL}/${no}`, item);
  }

  remove(no: string) {
    return Request.delete(`${baseURL}/${no}`);
  }

  exists(no: string) {
    return Request.get(`${baseURL}/check/${no}`);
  }
}

export default new DataSourceService();
