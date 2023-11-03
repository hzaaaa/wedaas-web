import { PORTBiz } from "@/api/config/servicePort";

import http from "@/api";





// **  添加一个新的标签和表
export const addLabelApi = (params: any) => {
  return http.post<any>(PORTBiz + `/label/addone`, params);
};
// **  删除标签
export const deleteLabelApi = (params: any) => {
  return http.delete<any>(PORTBiz + `/label/deleteById/${params.id}`, params);
};
// **  删除 label对应的表
export const deleteEditLabelInfoApi = (params: any) => {
  return http.post<any>(PORTBiz + `/label/editLabelInfo`, params);
};
// **  新增标签
export const insertLabelApi = (params: any) => {
  return http.post<any>(PORTBiz + `/label/insertLabel`, params);
};
// **  获取标签列表
export const getLabelListApi = (params: any) => {
  return http.get<any>(PORTBiz + `/label/list`, params);
};
// **  根据labelId查询表 
export const selectListByLableIdApi = (params: any) => {
  return http.post<any>(PORTBiz + `/label/selectListByLableId`, params);
};
// **  在标签下添加表 
export const setTableFromLabelApi = (params: any) => {
  return http.post<any>(PORTBiz + `/label/setTableFromLabel`, params);
};
// **  根据标签已添加的表，过滤掉重复的表 
export const tableFilterApi = (params: any) => {
  return http.post<any>(PORTBiz + `/label/tableFilter`, params);
};
// **  修改标签 
export const updateLabelApi = (params: any) => {
  return http.post<any>(PORTBiz + `/label/updateLabel`, params);
};
// **  子页面list 
export const getTableByDataSourceIdandLabelIdApi = (params: any) => {
  return http.post<any>(PORTBiz + `/database/getTableByDataSourceIdandLabelId`, params);
};