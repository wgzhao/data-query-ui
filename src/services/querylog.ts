import {ref} from 'vue'
import Request from '@/util/request'

const apiPrefix = ref("/queryLog")

const list = (page: number, pageSize: number, sortBy) => {
  console.log("func list , sortby = ", sortBy)
  return Request.get(`${apiPrefix.value}`,
    {
      page: page,
      size: pageSize,
      sort: [sortBy]
    }
  )}

const searchAppId = (appId: string, page: number, pageSize: number, sortBy) => {
  return Request.get(`${apiPrefix.value}/by/appId/${appId}`,
     {
      page: page,
      size: pageSize,
      sort: sortBy
    }
  )}

const searchSelectId = (selectId: string, page: number, pageSize: number, sortBy) => {
  return Request.get(`${apiPrefix.value}/by/selectId/${selectId}`,
    {
      page: page,
      size: pageSize,
      sort: sortBy
    }
  )}
export default {list, searchAppId, searchSelectId}
