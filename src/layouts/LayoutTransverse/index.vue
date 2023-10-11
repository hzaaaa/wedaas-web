<!-- 纵向布局 -->
<template>
	<el-container class="layout">
		<el-header>
			<div class="logo-img flx-center">
				<img
					srcset="
						@/assets/images/Logo.png    1x,
						@/assets/images/Logo.png    1.5x,
						@/assets/images/Logo@2x.png 2x,
						@/assets/images/Logo@2x.png 3x
					"
					src="@/assets/images/Logo.png"
					alt="logo"
				/>
			</div>
			<div class="header-ri">
				<!-- <ToolBarLeft />  -->
				<TopMenu />
				<ToolBarRight />
			</div>
		</el-header>
		<!-- <el-container style="flex: 1; height: 0" class="outer-container"> -->
		<!-- <el-aside :class="[subMenuList.length == 0 ? 'sidebar-not-show' : '']">
				<div class="menu" :class="[subMenuList.length == 0 ? 'sidebar-not-show' : '']">
					<el-scrollbar>
						<el-menu :default-active="activeSubMenu" :router="false" :collapse-transition="false" :unique-opened="true">
							<SubMenu :menuList="subMenuList" />
						</el-menu>
						<div class="ml20 mt20" v-show="route.path.includes('systemManage')">
							<el-button type="primary" v-permission="['refreshRoute']" @click="refreshRouteClick"> 刷新路由 </el-button>
						</div>
					</el-scrollbar>
				</div>
			</el-aside> -->
		<!-- <el-container class="inner-container" id="container"><Breadcrumb /><Main /></el-container> -->
		<!-- </el-container> -->
		<Main />
	</el-container>
</template>

<script setup lang="ts" name="layoutVertical">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { AuthStore } from "@/stores/modules/auth";
import ToolBarRight from "../components/Header/ToolBarRight.vue";
import Main from "@/layouts/components/Main/index.vue";
import SubMenu from "@/layouts/components/Menu/SubMenu.vue";
import ToolBarLeft from "@/layouts/components/Header/ToolBarLeft.vue";
import Breadcrumb from "@/layouts/components/Header/components/Breadcrumb.vue";
import TopMenu from "@/layouts/components/Menu/TopMenu.vue";
// import { refreshRouteApi } from "@/api/biz/options";
import { ElMessage } from "element-plus";
// import TopMenu from "@/layouts/components/Menu/TopMenu.vue";
const refreshRouteClick = () => {
	// refreshRouteApi({}).then(() => {
	// 	ElMessage.success("刷新路由成功");
	// });
};
const route = useRoute();
const authStore = AuthStore();
const activeSubMenu = computed(() => {
	console.log(route.matched, route.path);
	console.log("authMenuList", authMenuList.value);

	let obj = findPath(route.path, { children: authMenuList.value });
	// debugger
	return obj?.path;
	// return (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string;
});
const findPath = (path: any, childrenParent: any): any => {
	for (let i = 0; i < childrenParent.children.length; i++) {
		let item = childrenParent.children[i];
		if (item.path === path) {
			// debugger
			if (item.meta.isHide) {
				return childrenParent;
			} else {
				return item;
			}
		}
	}
	for (let i = 0; i < childrenParent.children.length; i++) {
		let item = childrenParent.children[i];
		if (item.children) {
			let obj = findPath(path, item);
			if (obj) {
				return obj;
			}
		}
	}
	// console.log('childrenParent',childrenParent.path)
	return null;
};
// const activeTopMenu = computed(() => {
// 	const activeTopMenuPath = authStore.breadcrumbListGet[route.matched[route.matched.length - 1].path][0].path ?? "";
// 	authStore.setActiveTopMenu(activeTopMenuPath);
// 	return activeTopMenuPath;
// });

// 记录上一个顶部路由
const preSubMenuList = ref([]);
const authMenuList = computed(() => authStore.authMenuListGet);
// const subMenuList = computed(() => {
// 	let subMenuListGet = authStore.subShowMenuListGet;
// 	console.warn("subShowMenuList", subMenuListGet);
// 	if (authStore.activeTopMenuPathGet.length) {
// 		preSubMenuList.value = subMenuListGet;
// 	}
// 	console.warn(preSubMenuList.value);

// 	if (!subMenuListGet.length) {
// 		subMenuListGet = preSubMenuList.value;
// 	}
// 	return subMenuListGet;
// });

// const topMenuList = computed(() => authStore.showMenuListGet);
</script>

<style scoped lang="scss">
@import "./index";
</style>

<style lang="scss">
.vertical {
	.el-menu,
	.el-menu--popup {
		.el-menu-item {
			&.is-active {
				background: #181c21;
				&::before {
					position: absolute;
					left: 0;
					top: 0;
					bottom: 0;
					width: 4px;
					background: var(--el-color-primary);
					content: "";
				}
			}
		}
	}
}
</style>
