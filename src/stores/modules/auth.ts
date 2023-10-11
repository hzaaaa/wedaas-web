import { defineStore } from "pinia";
import { AuthState } from "@/stores/interface";
import { getAuthButtonListApi } from "@/api/modules/login";
import { getFlatArr } from "@/utils/util";
import { postOriginAuthMenuListApi } from "@/api/modules/login";
import { getAuthMenuList, getShowMenuList, getAllBreadcrumbList, getSubMenuList } from "@/utils/util";
import { useUserStore } from "../user";

// AuthStore
export const AuthStore = defineStore({
	id: "AuthState",
	state: (): any => ({
		// 菜单权限列表
		authOriginMenuList: <OriginMenu.OriginMenuOptions[]>[],
		authMenuList: [],
		showAuthMenuList: [],
		activeTopMenuPath: "",

		// 按钮权限列表
		authButtonList: [],
	}),
	getters: {
		// 按钮权限列表
		authButtonListGet: (state) => state.authButtonList,
		// 后端返回的原始菜单
		authOriginMenuListGet: () => {
			const userStore = useUserStore();
			return userStore.userInfo.menuVoList;
		},
		routerLikeMenuListGet: () => {
			const userStore = useUserStore();
			return getAuthMenuList(userStore.userInfo.menuVoList);
		},
		// 后端返回的菜单列表 ==> 这里没有经过任何处理
		authMenuListGet: (state) => state.authMenuList,
		// 后端返回的菜单列表 ==> 用于菜单栏渲染，需要去除 isHide == true
		showMenuListGet: (state) => state.showAuthMenuList,
		// 扁平化之后的一维数组路由，主要用来添加动态路由
		flatMenuListGet: (state) => getFlatArr(state.authMenuList),
		// 所有的面包屑导航列表
		breadcrumbListGet: (state) => getAllBreadcrumbList(state.authMenuList),
		// 顶部导航path
		activeTopMenuPathGet: (state) => state.activeTopMenuPath,
		// 左侧菜单渲染
		subShowMenuListGet: (state) => getSubMenuList(state.showAuthMenuList, state.activeTopMenuPath),
	},
	actions: {
		// 获取按钮权限列表
		async getAuthButtonList() {
			const { data } = await getAuthButtonListApi();
			this.authButtonList = data;
		},
		// 设置原始菜单列表方法
		// async getAuthOriginMenuList() {
		// 	const { data } = await postOriginAuthMenuListApi();
		//   this.authOriginMenuList = data;
		// },
		// 设置原始菜单列表方法
		async setAuthOriginMenuList(menuList: OriginMenu.OriginMenuOptions[]) {
			this.authOriginMenuList = menuList;
		},
		// getAuthMenuList
		async setAuthMenuList() {
			const routerArrList = this.routerLikeMenuListGet;
			this.authMenuList = routerArrList;
		},

		// set activeTopMenu
		async setActiveTopMenu(menuPath: string) {
			this.activeTopMenuPath = menuPath;
		},

		async setShowMenuList(menuList: Menu.MenuOptions[]) {
			this.showAuthMenuList = getShowMenuList(menuList);
		},
	},
	persist: { key: "AuthState", storage: window.localStorage, paths: ["authOriginMenuList", "authButtonList"] },
});
