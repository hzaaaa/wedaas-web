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
// **  数据库 事实表 apiConfig
export const tablesForQueryByUserIdNoPageApi = (params: any) => {
  return http.post<any>(PORTBiz + `/database/tablesForQueryByUserIdNoPage`, params);
};
// **  数据库 实时列信息
export const getColsInfoRealtimeApi = (params: any) => {
  return http.post<any>(PORTBiz + `/table/colsInfoRealtime`, params);
};
// **  数据库 实时列信息 apiConfig
export const getColsInfoApi = (params: any) => {
  return http.post<any>(PORTBiz + `/table/colsInfo?tableId=${params.tableId}`, params);
};
// **  数据库 生成api数量 apiConfig
export const getApiListQueryBytableNameApi = (params: any) => {
  return http.post<any>(PORTBiz + `/apiManage/apiListQueryBytableName`, params);
};
// **  数据库 查询
export const sqlQueryApi = (params: any) => {
  return http.post<any>(PORTBiz + `/sql/query/${params.uuid}`, params);
};
// **  数据库 历史查询
export const historyQueryApi = (params: any) => {
  return http.post<any>(PORTBiz + `/execute/queryByUser`, params);
};
// **  数据库 保存的查询
export const saveSqlQueryApi = (params: any) => {
  return http.get<any>(PORTBiz + `/user/usersavesqlquery`, params);
};
// **  数据库 历史导出
export const historyExportApi = (params: any) => {
  return http.get<any>(PORTBiz + `/export/task`, params);
};
// **  数据库 保存查询
export const saveQueryStrApi = (params: any) => {
  return http.post<any>(PORTBiz + `/user/saveQuery`, params);
};
// **  数据库 在线导出文件
export const exportFileAPi = (params: any) => {
  return http.post<any>(PORTBiz + `/export/save/sql`, params);
};
// **  数据库 构建sql
export const buildSQLApi = (params: any) => {
  return http.post<any>(PORTBiz + `/api/buildSQL`, params);
};
// **  数据库 test 执行sql
export const testExecSqlApi = (params: any) => {
  return http.post<any>(PORTBiz + `/sql/apitest/${params.uuid}`, params);
};
// **  api list at api config
export const queryApiLisByDatasourceApi = (params: any) => {
  return http.post<any>(PORTBiz + `/apiManage/queryApiLisByDatasource`, params);
};

