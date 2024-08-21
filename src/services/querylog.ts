import { ref } from "vue";
import Request from "@/util/request";

const apiPrefix = ref("/queryLog");

const list = (page: number, pageSize: number, sortBy: Map<string, any>) => {
  return Request.get(`${apiPrefix.value}`, {
    page: page,
    size: pageSize,
    sortKey: sortBy["sortKey"],
    sortOrder: sortBy["sortOrder"]
  });
};

const search = (
  q: string,
  page: number,
  pageSize: number,
  sortBy: Map<string, any>
) => {
  return Request.get(`${apiPrefix.value}/search`, {
    q: q,
    page: page,
    size: pageSize,
    sortKey: sortBy["sortKey"],
    sortOrder: sortBy["sortOrder"]
  });
};
export default { list, search };
