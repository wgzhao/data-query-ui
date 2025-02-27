import { ref } from "vue";
import Request from "@/util/request";
import { QueryConfig } from "@/types";

const BASE_URL = "/queryConfig";

class QueryConfigService {
  /**
   * Get all query configurations
   */
  list() {
    return Request.get(BASE_URL);
  }

  /**
   * Get a specific query configuration by ID
   */
  get(id: string) {
    return Request.get(`${BASE_URL}/${id}`);
  }

  /**
   * Get available database sources
   */
  getDbSources() {
    return Request.get(`${BASE_URL}/datasources`);
  }

  /**
   * Save a query configuration
   */
  save(item: QueryConfig) {
    return Request.post(BASE_URL, item);
  }

  /**
   * Delete a query configuration by ID
   */
  remove(id: string) {
    return Request.delete(`${BASE_URL}/${id}`);
  }

  /**
   * Check if a query configuration with the given ID exists
   */
  exists(id: string) {
    const flag = ref(false);

    Request.get(`${BASE_URL}/${id}`)
      .then(response => (flag.value = response.data.id === id))
      .catch(error => console.error("Error checking if config exists:", error));

    return flag;
  }

  /**
   * Get parameters for a specific query configuration
   */
  getParams(id: string) {
    return Request.get(`${BASE_URL}/params/${id}`);
  }

  /**
   * Save parameters for a query configuration
   */
  saveParams(params: any) {
    return Request.put(`${BASE_URL}/params`, params);
  }

  /**
   * Delete cache for a specific query configuration
   */
  deleteCache(id: string) {
    return Request.delete(`${BASE_URL}/cache/${id}`);
  }
}

export default new QueryConfigService();
