import {ref} from 'vue'
import Request from '@/util/request'

const apiPrefix = ref("/queryLog")

const list = (page: number, pageSize: number) => {
  return Request.get(`${apiPrefix.value}`,
    {
      page: page,
      size: pageSize
    }
  )}

const searchAppId = (appId: string, page: number, pageSize: number) => {
  return Request.get(`${apiPrefix.value}/by/appId/${appId}`,
     {
      page: page,
      size: pageSize
    }
  )}

const searchSelectId = (selectId: string, page: number, pageSize: number) => {
  return Request.get(`${apiPrefix.value}/by/selectId/${selectId}`,
    {
      page: page,
      size: pageSize
    }
  )}
export default {list, searchAppId, searchSelectId}
