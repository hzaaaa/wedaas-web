<template>
	<el-dropdown class="avatar" popper-class="avatar-popper" placement="bottom-end">
		<span
			><el-avatar :icon="UserFilled" :size="29" :src="userStore?.userInfo?.avatarUrl"></el-avatar
			><span class="username" style="color: #fff">{{ userStore.username }}</span
			><el-icon class="el-icon--right"> <arrow-down /> </el-icon
		></span>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item @click="jumpToPersonalCenter">个人中心</el-dropdown-item>
				<el-dropdown-item @click="jumpToApprovalCenter">审批中心</el-dropdown-item>
				<el-dropdown-item>帮助支持</el-dropdown-item>
				<el-dropdown-item @click="openAboutUsDialog">关于我们</el-dropdown-item>
				<el-dropdown-item @click="logout">退出系统</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
	<AboutUsDialog ref="aboutUsDialogRef" />
</template>

<script setup lang="ts">
import {} from "vue";
import { UserFilled } from "@element-plus/icons-vue";
import { logoutApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { LOGIN_URL } from "@/config/config";
import { ElMessageBox, ElMessage } from "element-plus";
import { AuthStore } from "@/stores/modules/auth";
import AboutUsDialog from "./AboutUsDialog.vue";

const router = useRouter();
const userStore = useUserStore();
const authStore = AuthStore();
const logout = async () => {
	ElMessageBox.confirm("您是否确认退出登录？", "温馨提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning",
	}).then(async () => {
		await logoutApi();

		userStore.$reset();
		localStorage.clear();
		// authStore.resetState();
		router.replace(LOGIN_URL);

		ElMessage.success("退出登录成功！");
	});
};

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
	cursor: pointer;
	:deep(.el-tooltip__trigger) {
		display: flex;
		align-items: center;
		.username {
			margin-left: 4px;
		}
		.el-icon--right {
			color: #fff;
		}
	}
}
</style>
