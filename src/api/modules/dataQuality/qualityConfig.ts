import { PORTBiz } from "@/api/config/servicePort";

import http from "@/api";

// **  数据质量配置修改
export const editQualityConfigApi = (params: any) => {
  return http.post<any>(PORTBiz + `/data_quality/conf/edit`, params);
};
// **  分页获取数据质量配置
export const getQualityConfigListApi = (params: any) => {
  return http.get<any>(PORTBiz + `/data_quality/conf/list`, params);
};