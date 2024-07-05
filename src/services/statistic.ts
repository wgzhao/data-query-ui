import { ref } from "vue";
import Request from "@/util/request";
const baseURL = ref("/statistic");

class Statistic {
  byDate() {
    return Request.get(`${baseURL.value}/byDate`, null);
  }
}

export default new Statistic();
