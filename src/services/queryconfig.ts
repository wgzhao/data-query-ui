import { ref } from "vue";

import Request from "@/utils/request";
import QueryConfig from "@/types/query-config";
const baseURL = "/queryConfig";
class QueryconfigService {
  list() {
    return Request.get(baseURL);
  }

  get(id: string) {
    return Request.get(`${baseURL}/${id}`);
  }

  getDbSources() {
    return Request.get(`${baseURL}/datasources`);
  }

  save(item: QueryConfig) {
    return Request.post(`${baseURL}`, item);
  }

  remove(id: string) {
    return Request.delete(`${baseURL}/${id}`);
  }

  exists(id: string) {
    const flag = ref(false);
    Request.get(`${baseURL}/${id}`)
      .then(res => (flag.value = res.data["id"] == id))
      .catch(err => console.log(err));
    return flag;
  }

  getParams(id: string) {
    return Request.get(`${baseURL}/params/${id}`);
  }

  saveParams(params: any) {
    return Request.put(`${baseURL}/params`, params);
  }

  deleteCache(selectId: string) {
    return Request.delete(`${baseURL}/cache/${selectId}`);
  }
}

export default new QueryconfigService();
