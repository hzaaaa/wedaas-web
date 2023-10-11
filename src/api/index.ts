// api/index.ts
import axios, { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { ResultEnum } from "@/enums/httpEnum";
import { checkStatus } from "./helper/checkStatus";
import { ResultData } from "@/api/interface/index";
import { useUserStore } from "@/stores/user";
import router from "@/routers";
import { LOGIN_URL } from "@/config/config";
import { ElMessage } from "element-plus";
import qs from "qs";
import abortController from "@/api/abort";
// import { Base64 } from "js-base64";

const config = {
	// 默认地址请求地址，可在 .env 开头文件中修改
	baseURL: import.meta.env.VITE_API_URL as string,
	// 设置超时时间（10s）
	timeout: ResultEnum.TIMEOUT as number,
};
const noAbortControllerUrl = <any>{
	"/api-proxy-manage/biz/dict/list": true,
	//待添加
};
class RequestHttp {
	service: AxiosInstance;
	public constructor(config: AxiosRequestConfig) {
		// 实例化 axios
		this.service = axios.create(config);

		/**
		 * @description 请求拦截器
		 * 客户端发送请求 -> [请求拦截器] -> 服务器
		 * token校验(JWT) : 接受服务器返回的token,存储到vuex/pinia/本地储存当中
		 */
		this.service.interceptors.request.use(
			(config: any) => {
				// console.log('config.url',config.url)
				// [取消请求控制器]中添加请求
				if (!noAbortControllerUrl[config.url]) {
					abortController.addPending(config);
				}
				const userStore = useUserStore();
				if (userStore.token) {
					// const token: string = Base64.decode(userStore.token);
					const token: string = userStore.token;
					if (config.headers && typeof config.headers?.set === "function") {
						config.headers.set("Authorization", `Bearer ${token}`);
					}
				}
				// get请求 序列化
				// let url = config.url;
				// console.log(config)
				if (config.method === "post" && config.request == "postParams") {
					// console.warn(config.method);
					// console.warn(config.params);
					// if (config.params) {
					//   console.warn(config.params);
					//   url += "?";
					//   let keys = Object.keys(config.params);
					//   for (let key of keys) {
					//     if (config.params[key]) {
					//       // console.log(encodeURIComponent(config.params[key]));
					//       url += `${key}=${encodeURIComponent(config.params[key])}&`;
					//     }
					//   }
					//   url = url?.substring(0, url.length - 1);
					//   config.params = {};
					// }
					// config.url = url;
					// config.paramsSerializer = {
					//   serialize: (params: any) => {
					//     // console.log(qs.stringify(params, { indices: false }));
					// 		console.log(params)
					//     return qs.stringify(params, { indices: false });
					//   },
					// };
					config.params = config.data;
				}
				return { ...config, headers: { ...config.headers } };
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);

		/**
		 * @description 响应拦截器
		 *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
		 */
		this.service.interceptors.response.use(
			(response: AxiosResponse) => {
				if (response.headers["content-disposition"]) {
					return response;
				}
				const { data, config } = response;
				abortController.canclePending(config);
				const userStore = useUserStore();
				if (data.code == ResultEnum.OVERDUE) {
					console.warn("415");
					ElMessage.error("账户登录已过期！");
					userStore.$reset();
					router.replace(LOGIN_URL);
					return Promise.reject(data);
				}
				// * 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
				if (data.code && data.code != ResultEnum.SUCCESS) {
					let codeOption = <any>{
						"200": "请求成功",
						// "500": "系统异常",
						"400": "参数错误",
						"401": "参数类型错误",
						"402": "请求体错误",
						"403": "请求方式错误",
						"404": "资源不存在",
						"405": "Content-Type错误",
						"406": "未登录",
						"413": "没有权限访问",
						"414": "用户不存在",
						"415": "登录过期",
						"416": "用户名或密码错误",
						"417": "密码过期",
						"418": "账号被禁用",
						"419": "账号已过期",
						"420": "账号被锁",
						"421": "授权错误",
						"422": "用户未授权",

						"10000": "权限不足",
						"10001": "验证码不存在或者过期",
						"10002": "验证码错误",
						"10003": "验证码配置错误",
						"10004": "账号被禁用",
						"10005": "用户名已存在",
						"10006": "手机号已存在",
						"10007": "角色名已存在",
						"10008": "角色删除失败，存在用户与角色关联",
						"10009": "父部门不存在",
						"10010": "部门不存在",

						"10011": "父节点未找到",
						"10012": "菜单不存在",
						"10013": "角色不存在",
						"10014": "用户不存在",

						"20000": "参数不完整",
						"20001": "路由已存在",
						"20002": "该API已被使用，无法停用",
						"20003": "该数据已被使用，无法下架",
						"20004": "接入API费用列表查询失败",
						"20005": "接入API配置修改失败",
						"20006": "接入API配置删除失败",
						"20007": "输出API费用列表查询失败",
						"20008": "输出API配置修改失败",
						"20009": "输出API配置删除失败",
						"20010": "该输出API配置已存在",
						"20011": "该数据资产接入配置已存在",
						"20012": "该数据资产输出配置已存在",
						"20013": "该合作方资源配置已存在",
					};
					if (data.msg == "原密码错误") {
						ElMessage.error("原密码错误");
					} else if (codeOption[data.code + ""]) {
						ElMessage.error(codeOption[data.code]);
					} else {
						ElMessage.error(data.msg);
					}
					// console.error("[响应拦截]", data.msg);
					// 服务器结果都没有返回(可能服务器错误可能客户端断网)，断网处理:可以跳转到断网页面
					// if (!window.navigator.onLine) router.replace("/500");
					return Promise.reject(data);
				}
				return data;
			},
			async (error: AxiosError) => {
				const { response } = error;
				if (response) checkStatus(response.status);
				return Promise.reject(response);
			}
		);
	}

	// * 常用请求方法封装
	get<T>(url: string, params?: object, _config = {}): Promise<ResultData<T>> {
		return this.service.get(url, { params, ..._config });
	}
	post<T>(url: string, params?: object, _config = {}): Promise<ResultData<T>> {
		return this.service.post(url, params, _config);
	}
	delete<T>(url: string, params?: object, _config = {}): Promise<ResultData<T>> {
		return this.service.delete(url, params);
	}
}

export default new RequestHttp(config);
