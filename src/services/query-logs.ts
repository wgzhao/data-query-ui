import { ref } from "vue";
import Request from "@/util/request";

// 定义一个明确的排序参数接口
interface SortOptions {
  sortKey: string;
  sortOrder: "asc" | "desc";
}

// 定义查询参数接口
interface QueryParams {
  page: number;
  size: number;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  q?: string;
}

const apiPrefix = ref("/query-logs");

/**
 * 获取查询日志列表
 * @param page 页码
 * @param pageSize 每页大小
 * @param sortOptions 排序选项
 * @returns 请求Promise
 */
const list = (page: number, pageSize: number, sortOptions: SortOptions) => {
  const params: QueryParams = {
    page,
    size: pageSize,
    sortKey: sortOptions.sortKey,
    sortOrder: sortOptions.sortOrder
  };

  return Request.get(`${apiPrefix.value}`, params);
};

/**
 * 搜索查询日志
 * @param q 搜索关键词
 * @param page 页码
 * @param pageSize 每页大小
 * @param sortOptions 排序选项
 * @returns 请求Promise
 */
const search = (
  q: string,
  page: number,
  pageSize: number,
  sortOptions: SortOptions
) => {
  const params: QueryParams = {
    q,
    page,
    size: pageSize,
    sortKey: sortOptions.sortKey,
    sortOrder: sortOptions.sortOrder
  };

  return Request.get(`${apiPrefix.value}/search`, params);
};

export default { list, search };
