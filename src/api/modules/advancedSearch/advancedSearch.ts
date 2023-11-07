import { PORTBiz } from "@/api/config/servicePort";
import { AdvancedSearch } from "@/api/interface/index";
import http from "@/api";

// 列表
export const postAdvancedSearchListApi = (params: AdvancedSearch.ReqAdvancedSearchList) => {
	return http.post<AdvancedSearch.ResAdvancedSearchList>(PORTBiz + `/search/go`, params);
};
