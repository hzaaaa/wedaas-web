import { createRouter, createWebHashHistory } from "vue-router";
import { staticRouter, userAccountRouter, errorRoutes } from "@/routers/modules/staticRouter";
import NProgress from "@/config/nprogress";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { AuthStore } from "@/stores/modules/auth";
import { useUserStore } from "@/stores/user";
import { LOGIN_URL } from "@/config/config";
// import { Base64 } from "js-base64";
import Cookie from "js-cookie";
import { getAuthCurrentInfoApi, getAuthCurrentTokenApi } from "@/api/modules/login";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [...staticRouter, ...errorRoutes],
	scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * @description 路由拦截
 **/
router.beforeEach(async (to, from, next) => {
	console.warn("from", from);
	console.warn("to", to);

	NProgress.start();

	const userStore = useUserStore();

	// 1. 出口放前面，防止路由无限循环跳转。如果访问登录页，有 token 停留在当前页，没有 token 清空路由缓存并重定向到登录页
	if (to.path === LOGIN_URL) {
		if (userStore.token) return next(from.fullPath);
		resetRouter();
		return next();
	}

	// 2. 获取用户登录状态，如果未登录则跳转到登录页
	const isSignOn = await getSignOnStatus();
	if (!isSignOn) {
		return next({ path: LOGIN_URL, replace: true });
	}

	// 3. 如果没有菜单列表，重新请求菜单列表并添加动态路由（手动刷新、输入地址跳转时）
	const authStore = AuthStore();
	if (!authStore.authMenuListGet.length) {
		await initDynamicRouter();
		return next({ ...to, replace: true });
	}

	// 4. 正常访问页面
	next();
});

/**
 * @description 获取用户登录状态, localStorage->cookie->token 接口依次判断. 已登录则返回true，并将 token 存入 localStorage; 否则返回 false
 * @returns {Boolean}
 */
const getSignOnStatus = async () => {
	const authStore = AuthStore();
	const userStore = useUserStore();
	// 如果 localStorage 有 token, 返回 true
	if (userStore.token) return true;
	const cookieToken = Cookie.get("token");
	// 如果 cookie 里有 token, 将 token 存到 localStorage 并返回 true
	if (cookieToken) {
		// userStore.setToken(Base64.encode(cookieToken));
		userStore.setToken(cookieToken);
		return true;
	}
	// 如果 cookie 里无 token, 调 token 接口取，能取到说明在其他系统已登录，取不到则进登录页
	if (!cookieToken) {
		try {
			return false;
			const { data } = await getAuthCurrentTokenApi();
			// 如果能取到 token, 将 token 存到 localStorage，请求用户信息接口，并返回 true
			if (data) {
				// userStore.setToken(Base64.encode(data));
				userStore.setToken(data);
				const { data: userInfo } = await getAuthCurrentInfoApi();
				userStore.setUserInfo(userInfo);
				userStore.setId(userInfo.sysUser.id);
				userStore.setUserName(userInfo.sysUser.username);
				authStore.setAuthOriginMenuList(userInfo.menuVoList);
				return true;
			}
		} catch (error) {
			console.log("getAuthCurrentTokenApi Error", error);
			return false;
		}
	}
	return false;
};

/**
 * @description 路由跳转结束
 * */
router.afterEach((to, from, failure) => {
	NProgress.done();
});

/**
 * @description 路由跳转错误
 * */
router.onError((error) => {
	NProgress.done();
	console.warn("路由错误", error.message);
});
// * 重置路由
export const resetRouter = () => {
	// console.log("reset");
	const authStore = AuthStore();
	authStore.flatMenuListGet.forEach((route: any) => {
		const { name } = route;
		if (name && router.hasRoute(name)) router.removeRoute(name);
	});
	userAccountRouter.forEach((route: any) => {
		console.log(route);
		const { name } = route;
		if (name && router.hasRoute(name)) router.removeRoute(name);
		// if (Object.prototype.hasOwnProperty.call(item, "children") && item["children"].length) {
		// 	item["children"].forEach((element) => {
		// 		console.warn(element)
		// 		router.addRoute("layout", element);
		// 	});
		// }
	});
	// router.removeRoute("layout");
	// router.removeRoute("default");
};
export default router;
