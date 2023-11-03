import { PORTBiz } from "@/api/config/servicePort";

import http from "@/api";

// **  用户自定义探查项查询
export const userRegularListApi = (params: any) => {
  return http.get<any>(PORTBiz + `/exploration/userRegularListQuery`, params);
};
// **  新增用户自定义探查项
export const insertUserRegularApi = (params: any) => {
  return http.post<any>(PORTBiz + `/exploration/insertUserRegular`, params);
};
// **  删除用户自定义探查
export const deleteUserRegularApi = (params: any) => {
  return http.post<any>(PORTBiz + `/exploration/deleteUserRegular`, params);
};
// **  修改用户自定义探查项
export const updateUserRegularApi = (params: any) => {
  return http.post<any>(PORTBiz + `/exploration/updateUserRegular`, params);
};