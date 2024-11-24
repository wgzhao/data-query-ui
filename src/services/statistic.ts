import { ref } from "vue";
import Request from "@/utils/request";
const baseURL = ref("/statistic");

class Statistic {
  byDate() {
    return Request.get(`${baseURL.value}/byDate`, null);
  }
}

export default new Statistic();
