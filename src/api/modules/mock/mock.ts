import http from "@/api";

export const getAdvancedSearchListApi = () => {
	return http.get<any>(`/advancedSearch/list`);
};