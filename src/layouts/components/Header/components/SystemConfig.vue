<template>
	<el-dropdown class="system-config" popper-class="avatar-popper" placement="bottom">
		<el-icon color="#fff"><Setting /></el-icon>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item @click="router.push({ name: 'accountManage' })">用户管理</el-dropdown-item>
				<el-dropdown-item @click="router.push({ name: 'informationAudit' })">信息审计</el-dropdown-item>
				<el-dropdown-item @click="router.push({ name: 'authorityManage' })">权限管理</el-dropdown-item>
				<el-dropdown-item @click="router.push({ name: 'dataConfig' })">数据配置</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
	<AboutUsDialog ref="aboutUsDialogRef" />
</template>

<script setup lang="ts">
import {} from "vue";

import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

import { AuthStore } from "@/stores/modules/auth";
import AboutUsDialog from "./AboutUsDialog.vue";

const router = useRouter();
const userStore = useUserStore();
const authStore = AuthStore();
const jumpToPersonalCenter = () => {
	console.log(authStore.activeTopMenuPathGet);
	authStore.setActiveTopMenu("");
	router.push({ name: "personalCenter" });
};

const jumpToApprovalCenter = () => {
	router.push({ name: "approvalCenter" });
};

const aboutUsDialogRef = ref<InstanceType<typeof AboutUsDialog> | null>(null);
const openAboutUsDialog = (info: any) => {
	const params = {
		info: info,
	};
	aboutUsDialogRef.value?.acceptParams(params);
};
</script>

<style lang="scss" scoped>
@import "@/styles/common";
.el-dropdown {
	align-items: center;
	margin-right: 20px;
	cursor: pointer;
	:deep(.el-tooltip__trigger) {
		display: flex;
		align-items: center;
	}
}
</style>
