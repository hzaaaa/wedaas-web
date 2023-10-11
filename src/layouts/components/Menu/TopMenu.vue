<template>
	<div class="top-menu">
		<el-menu :default-active="activeMenu" mode="horizontal" :router="false">
			<!-- <el-menu-item v-for="subItem in topMenuList" :key="subItem.path" :index="subItem.path" @click="handleClickTopMenu(subItem)">
		<template #title>
			<span>{{ subItem.meta.title }}</span>
		</template>
	</el-menu-item> -->
			<template v-for="subItem in topMenuList" :key="subItem.path">
				<el-sub-menu
					v-if="subItem.children && subItem.children.length > 0"
					:key="subItem.path"
					:index="subItem.path + 'el-sub-menu'"
				>
					<template #title>
						<el-icon>
							<component :is="subItem.meta.icon"></component>
						</el-icon>
						<!-- <SvgIcon
						:name="iconArr(subItem.meta.icon)[0]"
						v-if="subItem.meta.icon"
						style=""
						:class="[iconArr(subItem.meta.icon).length > 1 ? iconArr(subItem.meta.icon)[1] : '']"
					></SvgIcon> -->
						<span>{{ subItem.meta.title }}</span>
					</template>
					<SubMenu :menuList="subItem.children" />
				</el-sub-menu>
				<el-menu-item v-else :key="subItem.path + 'el-menu-item'" :index="subItem.path" @click="handleClickMenu(subItem)">
					<el-icon size="12" v-if="subItem.meta.icon">
						<component :is="subItem.meta.icon"></component>
					</el-icon>
					<template #title>
						<span>{{ subItem.meta.title }}</span>
					</template>
				</el-menu-item>
			</template>
		</el-menu>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AuthStore } from "@/stores/modules/auth";
import SubMenu from "@/layouts/components/Menu/SubMenu.vue";
// defineProps<{ topMenuList: any }>();

const route = useRoute();
const authStore = AuthStore();
const router = useRouter();

const topMenuList = computed(() => {
	console.log(authStore.showMenuListGet);
	return authStore.showMenuListGet;
});

// const handleClickTopMenu = (subItem: any) => {
// 	if (subItem.meta.isLink) return window.open(subItem.meta.isLink, "_blank");
// 	if (authStore.activeTopMenuPathGet != subItem.path) {
// 		router.push(subItem.path);
// 	}
// };

const handleClickMenu = (subItem: any) => {
	if (subItem.meta.isLink) return window.open(subItem.meta.isLink, "_blank");
	router.push(subItem.path);
};

// const activeTopMenu = computed(() => {
// 	const activeTopMenuPath = authStore.breadcrumbListGet[route.matched[route.matched.length - 1].path]
// 		? authStore.breadcrumbListGet[route.matched[route.matched.length - 1].path][0].path
// 		: "";
// 	if (activeTopMenuPath.length) authStore.setActiveTopMenu(activeTopMenuPath);
// 	// console.log(authStore.activeTopMenuPathGet);
// 	return activeTopMenuPath;
// });
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path));

const iconArr = (metaIcon: string): Array<string> => {
	const newIconArr = metaIcon.split(",");
	console.log(newIconArr);
	return newIconArr;
};
</script>

<style lang="scss" scoped>
// .el-menu {
// flex: 1;

// background-color: #112625;
:deep(.el-sub-menu) {
	.el-sub-menu__title {
		padding-left: 0;

		// padding-right: 0;
		span {
			color: #fff;
		}
		.el-icon {
			color: #fff;
		}
	}
	&:hover {
		.el-sub-menu__title {
			background-color: #112625 !important;
			span {
				color: var(--el-color-primary);
			}
			.el-icon {
				color: var(--el-color-primary);
			}
		}
	}
	&:focus {
		background-color: #112625 !important;

		// span {
		// 	color: #000000;
		// }
		color: #fff;
	}
	&.is-active {
		.el-sub-menu__title {
			span {
				color: var(--el-color-primary);
			}
		}
	}
}
.el-menu-item {
	// 	position: relative;
	// 	align-items: flex-start;
	// 	border-bottom: none;
	// 	height: 80px;
	// 	background-color: #112625;
	// 	vertical-align: top;
	// color: #adb7b7;
	color: #fff;

	// 	span {
	// 		margin-top: 24px;
	// 		height: 22px;
	// 		line-height: 22px;
	// 		font-size: 16px;
	// 	}
	&:hover {
		background-color: #112625 !important;

		// span {
		// 	color: #000000;
		// }
		color: #fff;
	}
	&:focus {
		background-color: #112625 !important;

		// span {
		// 	color: #000000;
		// }
		color: #fff;
	}

	// 	&::before {
	// 		// display: none;
	// 		position: absolute;
	// 		bottom: 23px;
	// 		width: 0;
	// 		height: 0;
	// 		background: #fff;
	// 		content: "";
	// 		transition: all 0.5s ease;
	// 	}
	// }
	// .el-menu-item.is-active {
	// 	color: #fff !important;
	// 	&::before {
	// 		display: block;
	// 		width: 24px;
	// 		height: 4px;
	// 	}
}

// }
// .el-menu--popup {
// 	.el-menu-item {
// 		&.is-active {
// 			background: #181c21;
// 			&::before {
// 				position: absolute;
// 				left: 0;
// 				top: 0;
// 				bottom: 0;
// 				width: 4px;
// 				background: var(--el-color-primary);
// 				content: "";
// 			}
// 		}
// 	}
// }
</style>
