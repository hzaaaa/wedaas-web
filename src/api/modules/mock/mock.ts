import http from "@/api";

export const getAdvancedSearchListApi = () => {
	return http.get<any>(`/advancedSearch/list`);
};

export const getMySaveListApi = () => {
	return http.get<any>(`/advancedSearch/mySave`);
};

export const getAPIConfigAPi = () => {
	return http.get<any>(`/advancedSearch/apiConfig`);
};
