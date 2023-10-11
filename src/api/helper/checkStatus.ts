import { ElMessage } from "element-plus";

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @return void
 */

export const checkStatus = (status: number): void => {
	switch (status) {
		case 10001:
			ElMessage.error("验证码过期，请重新点击验证码刷新！");
			break;
		case 10002:
			ElMessage.error("验证码错误！");
			break;
		case 415:
			ElMessage.error("登录过期！");
			break;
		case 416:
			ElMessage.error("用户名或密码错误！");
			break;
		// case 405:
		// 	ElMessage.error("请求方式错误！请您稍后重试");
		// 	break;
		// case 408:
		// 	ElMessage.error("请求超时！请您稍后重试");
		// 	break;
		// case 500:
		// 	ElMessage.error("服务异常！");
		// 	break;
		// case 502:
		// 	ElMessage.error("网关错误！");
		// 	break;
		// case 503:
		// 	ElMessage.error("服务不可用！");
		// 	break;
		// case 504:
		// 	ElMessage.error("网关超时！");
		// 	break;
		default:
			ElMessage.error("请求失败！");
	}
};
