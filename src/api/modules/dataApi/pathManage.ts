import { PORTBiz } from "@/api/config/servicePort";

import http from "@/api";

// **  获取API路径目录
export const getApiPathListApi = (params: any) => {
  return http.get<any>(PORTBiz + `/apiManage/getApiPathList`, params);
};
// **  根据API路径获取API列表
export const getApiListByPathApi = (params: any) => {
  return http.post<any>(PORTBiz + `/apiManage/getApiListByPath`, params);
};
// **  保存API路径
export const addApiPathApi = (params: any) => {
  return http.post<any>(PORTBiz + `/apiManage/addApiPath`, params);
};
// **  删除API路径
export const delApiPathApi = (params: any) => {
  return http.post<any>(PORTBiz + `/apiManage/delApiPath`, params);
};