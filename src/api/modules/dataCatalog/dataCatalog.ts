import { PORTBiz } from "@/api/config/servicePort";

import http from "@/api";





// **  获取目录信息
export const getCatalogInfoApi = (params: any) => {
  return http.get<any>(PORTBiz + `/catalog/info`, params);
};
// **  查找目录下所有表
export const findTablesApi = (params: any) => {
  return http.get<any>(PORTBiz + `/catalog/findTables`, params);
};
// **  添加一个根目录，或者同时添加根目录与子目录
export const addCatalogApi = (params: any) => {
  return http.post<any>(PORTBiz + `/catalog/save`, params);
};
// **  编辑数据目录
export const editCatalogApi = (params: any) => {
  return http.post<any>(PORTBiz + `/catalog/edit`, params);
};
// **  按id删除主目录
export const delRootCatalogApi = (params: any) => {
  return http.delete<any>(PORTBiz + `/catalog/delRoot/${params.id}`, params);
};
// **  按id删除主目录
export const delChildCatalogApi = (params: any) => {
  return http.delete<any>(PORTBiz + `/catalog/delChild/${params.id}`, params);
};
// **  delete_table
export const deleteTableApi = (params: any) => {
  return http.post<any>(PORTBiz + `/catalog/deleteTable`, params);
};
// **  设置多个表到某个目录下
export const editMultiTableApi = (params: any) => {
  return http.post<any>(PORTBiz + `/catalog/editMultiTable`, params);
};
// **  查找未分配目录的table list
export const getTableByDataSourceIdAndchildIdApi = (params: any) => {
  return http.post<any>(PORTBiz + `/database/getTableByDataSourceIdAndchildId`, params);
};





// **  查找所有未分组表
export const getCatalogListApi = (params: any) => {
  return http.get<any>(PORTBiz + `/catalog/list`, params);
};
// **   
export const getDSSelectorApi = (params: any) => {
  return http.post<any>(PORTBiz + `/searchfilter/dsNameQuery`);
};
// **   
export const getDBSelectorApi = (params: any) => {
  return http.get<any>(PORTBiz + `/database/list/${params.dsName}/${params.metastoreType}`);
};
// **   
export const getDBInfoSelectorApi = (params: any) => {
  return http.get<any>(PORTBiz + `/database/info/${params.dsName}/${params.metastoreType}`);
};