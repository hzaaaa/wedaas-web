import { AUTHPORT } from "@/api/config/servicePort";
import { User } from "@/api/interface/index";
import http from "@/api";

/**
 * @name 用户基本信息
 */

// // * 上传头像
// export const postAvatarUploadApi = (params: any) => {
// 	return http.post<any>(AUTHPORT + `/user/avatar/upload`, params);
// };

// // * 修改头像
// export const postAvatarEditionApi = (params: User.ReqAvatarEdition, _config = { request: "postParams" }) => {
// 	return http.post<any>(AUTHPORT + `/user/avatar`, params, _config);
// };

// // ** 修改密码
// export const postUserPwdEdition = (params: User.ReqPwdEditon) => {
// 	return http.post<any>(AUTHPORT + `/user/pwd/edit`, params);
// };

// 获取用户信息
export const getUserInfoApi = (params: User.ReqUserInfo) => {
	return http.get<any>(AUTHPORT + `/user/info/${params.id}`);
};

// 关注列表
export const getUserFavorInfoListApi = (params: User.ReqUserFavorInfoList) => {
	return http.get<User.ResUserFavorInfoList[]>(AUTHPORT + `/user/favorInfo/${params.id}`);
};

// 添加关注
export const postFavoriteAdditionApi = (params: User.ReqFavoriteAddition) => {
	return http.post<any>(AUTHPORT + `/favorite/add`, params);
};

// 取消关注
export const postFavoriteDeletionApi = (params: User.ReqFavoriteDeletion) => {
	return http.post<any>(AUTHPORT + `/favorite/del`, params);
};
