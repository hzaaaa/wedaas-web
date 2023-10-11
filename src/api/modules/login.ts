import { Login, Captcha } from "@/api/interface/index";
import { AUTHPORT } from "@/api/config/servicePort";
// import DynamicRouter from "@/assets/json/dynamicRouter.json";
import loginResult from "@/assets/json/loginResult.json";
import http from "@/api";
/**
 * @name 登录模块
 */
export const loginApi = (params: Login.ReqLoginForm) => {
	return new Promise((resolve) => {
		resolve(loginResult);
	});
	return http.post<Login.ResLogin>(AUTHPORT + `/auth/login`, params);
};
/**
 * @name 获取验证码模块
 */
export const getCaptchaApi = () => {
	return http.get<Captcha.ResCaptcha>(AUTHPORT + `/auth/captcha`);
};
/**
 * @name 检测用户ip
 */
export const checkOrgIpApi = (params: Login.ResOrgIpCheck) => {
	return http.get<any>(AUTHPORT + `/organization/ip/check`, params);
};
/**
 * @name 获取菜单列表模块
 */
export const postOriginAuthMenuListApi = () => {
	return http.post<OriginMenu.OriginMenuOptions[]>(AUTHPORT + `/menu/getMenuTree`);
	// return DynamicRouter; // 模拟登录返回静态路由
};
/**
 * @name 退出登录模块
 */
export const logoutApi = () => {
	return http.post(AUTHPORT + `/auth/logout`);
};
/**
 * @name 获取按钮权限列表
 */
export const getAuthButtonListApi = () => {
	return http.get(AUTHPORT + `/menu/auth/user/permission`);
};
/**
 * @name 获取当前用户的token
 */
export const getAuthCurrentTokenApi = () => {
	return http.get<any>(AUTHPORT + `/auth/current/token`);
};
/**
 * @name 获取当前用户的用户信息
 */
export const getAuthCurrentInfoApi = () => {
	return http.get<any>(AUTHPORT + `/user/info`);
};
