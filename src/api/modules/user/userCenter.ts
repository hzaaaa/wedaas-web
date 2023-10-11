import { AUTHPORT } from "@/api/config/servicePort";
import { User } from "@/api/interface/index";
import http from "@/api";

/**
 * @name 用户基本信息
 */

// * 上传头像
export const postAvatarUploadApi = (params: any) => {
	return http.post<any>(AUTHPORT + `/user/avatar/upload`, params);
};

// * 修改头像
export const postAvatarEditionApi = (params: User.ReqAvatarEdition, _config = { request: "postParams" }) => {
	return http.post<any>(AUTHPORT + `/user/avatar`, params, _config);
};

// ** 修改密码
export const postUserPwdEdition = (params: User.ReqPwdEditon) => {
	return http.post<any>(AUTHPORT + `/user/pwd/edit`, params);
};
