import { PORTBiz } from "@/api/config/servicePort";
import { TableInfo } from "@/api/interface/index";
import http from "@/api";

// 详情
export const postTableInfoApi = (params: TableInfo.ReqTableInfo) => {
	return http.post<any>(PORTBiz + `/table/getTableInfo`, params);
};

// 属性编辑
export const postTableInfoUpdateApi = (params: TableInfo.ReqTableInfoUpdate) => {
	return http.post<any>(PORTBiz + `/table/updateTableInfo`, params);
};

// 标签addone
export const postLabelAdditionApi = (params: TableInfo.ReqLabelAddition) => {
	return http.post<any>(PORTBiz + `/label/addone`, params);
};
