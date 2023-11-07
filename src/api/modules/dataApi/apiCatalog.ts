import { PORTBiz } from "@/api/config/servicePort";

import http from "@/api";

// **  获取个人目录信息
export const getApiCataQueryForMyuseApi = (params: any) => {
  return http.post<any>(PORTBiz + `/apicatalog/apiCataQueryForMyuse`, params);
};
// **  移动Api
export const changeApiSrcApi = (params: any) => {
  return http.get<any>(PORTBiz + `/apicatalog/changeApiSrc`, params);
};
// **  移动子目录
export const changeChildApi = (params: any) => {
  return http.get<any>(PORTBiz + `/apicatalog/changeChild`, params);
};
// **  获取数据市场目录信息
export const datamarketCatalogApi = (params: any) => {
  return http.get<any>(PORTBiz + `/apicatalog/datamarketCatalog`, params);
};
// **  按名字删除子目录
export const delChildApiCatalogApi = (params: any) => {
  return http.delete<any>(PORTBiz + `/apicatalog/delChild/${params.id}`, params);
};
// **  按id删除主目录
export const delRootApiCatalogApi = (params: any) => {
  return http.delete<any>(PORTBiz + `/apicatalog/delRoot/${params.id}`, params);
};
// **  移除目录下某个api
export const deleteApiAtCatalogApi = (params: any) => {
  return http.delete<any>(PORTBiz + `/apicatalog/deleteApi/${params.apiId}/${params.childId}`, params);
};
// **  编辑目录名称
export const editNameApi = (params: any) => {
  return http.post<any>(PORTBiz + `/apicatalog/edit/name`, params);
};
// **  获取全部目录信息
export const getAllApiCatalogApi = (params: any) => {
  return http.post<any>(PORTBiz + `/apicatalog/getAllApiCatalog`, params);
};
// **  获取目录信息
export const getCatalogApi = (params: any) => {
  return http.get<any>(PORTBiz + `/apicatalog/info`, params);
};
// **  添加目录
export const addApiCatalogApi = (params: any) => {
  return http.post<any>(PORTBiz + `/apicatalog/save`, params);
};


// **  right-list-api
export const apiManageListAPI = (params: any) => {
  return http.post<any>(PORTBiz + `/apiManage/list`, params);
};
// **  api详情 
export const getApiDetailsApi = (params: any) => {
  return http.get<any>(PORTBiz + `/apiManage/info/${params.id}`, params);
};
// **   api详情 分享记录
export const getApiShareRecordApi = (params: any) => {
  return http.get<any>(PORTBiz + `/apiManage/share/list/${params.id}`, params);
};
// **  创建人selector
export const createbySelecterApi = (params: any) => {
  return http.get<any>(PORTBiz + `/market/list/createby`, params);
};
