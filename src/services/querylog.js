import {ref} from 'vue'
import Request from '@/util/request'

const apiPrefix = ref("/querylogs")

const list = (page, pageSize) => {
  return Request.get(`${apiPrefix.value}`,
    {
      page: page,
      size: pageSize
    }
  )}

const searchAppId = (appId, page, pageSize) => {
  return Request.get(`${apiPrefix.value}/by/appId/${appId}`,
     {
      page: page,
      size: pageSize
    }
  )}

const searchSelectId = (selectId, page, pageSize) => {
  return Request.get(`${apiPrefix.value}/by/selectId/${selectId}`,
    {
      page: page,
      size: pageSize
    }
  )}
export default {list, searchAppId, searchSelectId}
