import router from "@/routers/index";
import { isType } from "@/utils/util";
import { LOGIN_URL } from "@/config/config";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { AuthStore } from "@/stores/modules/auth";
import { userAccountRouter } from "@/routers/modules/staticRouter";

// 引入 views 文件夹下所有 vue 文件
const modules = import.meta.glob("@/views/**/*.vue");

/**
 * 初始化动态路由
 */

let dynamicHomeRouter = [
	{
		path: "/",
		name: "default",
		redirect: "",
	},
	{
		path: "/layout",
		name: "layout",
		component: () => import("@/layouts/index.vue"),
		// component: () => import("@/layouts/indexAsync.vue"),
		redirect: "",
		children: [
			// {
			// 	path: "/collaboratorManage/collaboratorsManage/collaborators/partnerDetails",
			// 	name: "partnerDetails",
			// 	component: () => import("@/views/collaboratorManage/collaboratorsManage/collaborators/components/partnerDetails.vue"),
			// },
			// 		{
			// 	path: "/userAccount",
			// 	name: "userAccount",
			// 	redirect: "/userAccount/basicInfo",
			// 	meta: {
			// 		title: "用户账户",
			// 		isHide: 1,
			// 		isAffix: 0,
			// 	},
			// 	children: [
			// 		{
			// 			path: "/userAccount/basicInfo",
			// 			name: "basicInfo",
			// 			component: () => import("@/views/userAccount/basicInfo/index.vue"),
			// 			meta: {
			// 				title: "用户基本信息",
			// 				isHide: 1,
			// 				isAffix: 0,
			// 			},
			// 		},
			// 	],
			// },
		],
	},
	// {
	//   path: "/:pathMatch(.*)*",
	//   component: () => import("@/views/errorPage/404.vue"),
	// },
];

export const initDynamicRouter = async () => {
	const authStore = AuthStore();
	const userStore = useUserStore();
	try {
		// await authStore.getAuthOriginMenuList();
		console.log(authStore.authOriginMenuListGet);
		await authStore.setAuthMenuList();
		console.warn("authStore.authMenuListGet", authStore.authMenuListGet);
		if (!authStore.authMenuListGet.length) {
			// ElNotification({
			// 	title: "无权限访问",
			// 	message: "当前账号无任何菜单权限，请联系系统管理员！",
			// 	type: "warning",
			// 	duration: 3000,
			// });
			ElMessage({
				showClose: false,
				message: "当前账号无任何菜单权限，请联系系统管理员！",
				type: "warning",
				duration: 3000,
			});
			userStore.setToken("");
			router.replace(LOGIN_URL);
			return Promise.reject("No permission");
		}

		await authStore.setShowMenuList(authStore.authMenuListGet);
		const defaultActiveTopMenuPath = authStore.authMenuListGet[0].path;
		await authStore.setActiveTopMenu(defaultActiveTopMenuPath);
		// ** 动态主页
		let HOME_URL = authStore.authMenuListGet[0].path;
		console.log(HOME_URL);
		dynamicHomeRouter.forEach((item) => {
			item.redirect = HOME_URL;
			router.addRoute(item);
		});

		// authStore.authMenuListGet.forEach((item) => {
		//   if (item.children?.length) {
		//     item.redirect = item.children[0].path;
		//   }
		// });

		// 3.添加动态路由
		authStore.flatMenuListGet.forEach((item: any) => {
			item.children && delete item.children;
			if (item.component && isType(item.component) == "string") {
				item.component = modules["/src/views" + item.component + ".vue"];
			}
			// console.log(item);
			if (item.meta && item.meta.isFull != undefined) {
				router.addRoute(item);
			} else {
				router.addRoute("layout", item);
			}
		});
		console.log(authStore.flatMenuListGet);

		// userAccountRouter.forEach((item) => {
		// 	console.log(item)
		// 	router.addRoute("layout", item);
		// 	// if (Object.prototype.hasOwnProperty.call(item, "children") && item["children"].length) {
		// 	// 	item["children"].forEach((element) => {
		// 	// 		console.warn(element)
		// 	// 		router.addRoute("layout", element);
		// 	// 	});
		// 	// }
		// });
		userAccountRouter.forEach((item) => {
			router.addRoute("layout", item);
		});
	} catch (error) {
		// 💢 当按钮 || 菜单请求出错时，重定向到登陆页
		userStore.setToken("");
		router.replace(LOGIN_URL);
		return Promise.reject(error);
		console.log("init dynamicRouter error");
	}
};
