import { PORTBiz } from "@/api/config/servicePort";

import http from "@/api";

// **  数据源selector
export const connectDsNameQueryApi = (params: any) => {
  return http.post<any>(PORTBiz + `/searchfilter/connectDsNameQuery`, params);
};
// **  数据库selector
export const getDBSelectorApi = (params: any) => {
  return http.get<any>(PORTBiz + `/database/infoForQuery/${params.dsName}/${params.metastoreType}`, params);
};
// **  数据库 断开链接
export const discardSqlApi = (params: any) => {
  return http.post<any>(PORTBiz + `/sql/discard/${params.uuid}/${params.linkType}`, params);
};

// **  数据库 事实表
export const getRealtimetablesApi = (params: any) => {
  return http.post<any>(PORTBiz + `/database/realtimetables`, params);
};
// **  数据库 实时列信息
export const getColsInfoRealtimeApi = (params: any) => {
  return http.post<any>(PORTBiz + `/table/colsInfoRealtime`, params);
};