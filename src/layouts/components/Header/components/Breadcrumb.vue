<template>
	<div class="breadcrumb-box">
		<el-breadcrumb separator="/" v-if="breadcrumbList.length">
			<el-breadcrumb-item
				class="breadcrumb-item"
				v-for="(item, index) in breadcrumbList"
				:key="item.path"
				:to="index !== breadcrumbList.length - 1 ? { path: `${item.path}` } : null"
				>{{ item.meta.title }}</el-breadcrumb-item
			>
		</el-breadcrumb>
		<el-button @click="handleBackBtn" link v-else>{{ "＜ 返回" }}</el-button>
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { AuthStore } from "@/stores/modules/auth";

const route = useRoute();
const router = useRouter();
const authStore = AuthStore();

const breadcrumbList = computed(() => {
	let breadcrumbData = authStore.breadcrumbListGet[route.matched[route.matched.length - 1].path] ?? [];
	breadcrumbData = breadcrumbData.filter((element: any) => !element.meta.isHide);
	// console.log(breadcrumbData);
	return breadcrumbData;
});

const handleBackBtn = () => {
	router.go(-1);
};
</script>

<style lang="scss" scoped>
.breadcrumb-box {
	padding: 20px 0 0 24px;
	height: 20px;
	background-color: #f6f6f6;
	transition: all 0.3s ease;
	:deep(.el-breadcrumb) {
		.el-breadcrumb__item {
			.el-breadcrumb__inner {
				&.is-link {
					font-weight: normal;
					color: #606266 !important;
				}
				&:hover {
					color: var(--el-color-primary) !important;
				}
			}
			&:last-child {
				.el-breadcrumb__inner {
					color: var(--el-color-primary) !important;
				}
			}
		}
	}
	:deep(.el-button) {
		&:hover {
			span {
				color: var(--el-color-primary);
			}
		}
	}
}
.breadcrumb-box.no-breadcrumb {
	// :class="[breadcrumbList.length ? '' : 'no-breadcrumb']" 控制样式
	height: 0;
}
</style>
