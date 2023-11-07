import { PORTBiz } from "@/api/config/servicePort";
import { AdvancedSearch } from "@/api/interface/index";
import http from "@/api";

// ** 数据源筛选条件

// 数据源选择框列表
export const postDataSourceNameListApi = () => {
	return http.post<AdvancedSearch.SearchFilter.ResDataSourceNameList[]>(PORTBiz + `/searchfilter/dsNameQuery`);
};

// 数据库选择框列表
export const getDatabaseListApi = (params: AdvancedSearch.SearchFilter.ReqDatabaseList) => {
	return http.get<AdvancedSearch.SearchFilter.ResDatabaseList[]>(
		PORTBiz + `/database/list/${params.dsName}/${params.metastoreType}`
	);
};

// 数据目录列表
export const getCatalogListApi = () => {
	return http.get<AdvancedSearch.SearchFilter.ResCatalogList[]>(PORTBiz + `/catalog/list/order`);
};

// 数据标签列表
export const getLabelListApi = () => {
	return http.get<AdvancedSearch.SearchFilter.ResLabelList[]>(PORTBiz + `/label/list/order`);
};
