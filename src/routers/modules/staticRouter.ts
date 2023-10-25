import { RouteRecordRaw } from "vue-router";
import { LOGIN_URL } from "@/config/config";

/**
 *@description staticRouter（静态路由）
 **/

export const staticRouter: RouteRecordRaw[] = [
	// {
	//   path: "/",
	//   redirect: HOME_URL,
	// },
	{
		path: LOGIN_URL,
		name: "Login",
		component: () => import("@/views/login/index.vue"),
		meta: {
			title: "登录",
		}, // 注意这里要带上 文件后缀.vue
	},
	// {
	// 	path: '/home',
	// 	name: "home",
	// 	component: () => import("@/views/home/index.vue"),
	// 	meta: {
	// 		title: "主页",
	// 	}, // 注意这里要带上 文件后缀.vue
	// },
	// {
	//   path: "/layout",
	//   name: "layout",
	//   component: () => import("@/layouts/index.vue"),
	//   redirect: HOME_URL,
	//   children: [],
	// },
	// ** 无需登录的路由
];

// ** 登录后添加的静态页面

// export const userAccountRouter = [
// 	{
// 		path: "/userAccount",
// 		name: "userAccount",
// 		redirect: "/userAccount/basicInfo",
// 		meta: {
// 			title: "用户账户",
// 			isLink: "",
// 			isHide: 1,
// 			isAffix: 0,
// 		},
// 		children: [
// 			{
// 				path: "/userAccount/basicInfo",
// 				name: "basicInfo",
// 				component: () => import("@/views/userAccount/basicInfo/index.vue"),
// 				meta: {
// 					title: "用户基本信息",
// 					isLink: "",
// 					isHide: 1,
// 					isAffix: 0,
// 				},
// 			},
// 		],
// 	},
// ];

export const userAccountRouter = [
	{
		path: "/home",
		name: "home",
		redirect: "/home/personalCenter",
		meta: {
			title: "用户账户",
			isHide: 1,
			isAffix: 0,
		},
	},

	{
		path: "/home/personalCenter",
		name: "personalCenter",
		component: () => import("@/views/home/personalCenter/index.vue"),
		meta: {
			title: "个人中心",
			isHide: 1,
			isAffix: 0,
		},
	},
	{
		path: "/home/approvalCenter",
		name: "approvalCenter",
		component: () => import("@/views/home/approvalCenter/index.vue"),
		meta: {
			title: "审批中心",
			isHide: 1,
			isAffix: 0,
		},
	},
];
export const errorRoutes = [
	{
		path: "/404",
		name: "404",
		component: () => import("@/views/errorPage/404.vue"),
		meta: {
			title: "404页面",
		},
	},
	{
		path: "/500",
		name: "500",
		component: () => import("@/views/errorPage/500.vue"),
		meta: {
			title: "500页面",
		},
	},
	// Resolve refresh page, route warnings
	{
		path: "/:pathMatch(.*)*",
		component: () => import("@/views/errorPage/404.vue"),
	},
];

// ** errorRouter(错误页面路由)
// export const errorRouter = [
//   {
//     path: "/404",
//     name: "404",
//     component: () => import("@/views/ErrorMessage/404.vue"),
//     meta: {
//       title: "404页面",
//     },
//   },
// ];

/**
 * notFoundRouter(找不到路由)
 */
// export const notFoundRouter = {
//   path: "/:pathMatch(.*)*",
//   name: "notFound",
//   component: () => import("@/views/ErrorMessage/404.vue"),
// };
