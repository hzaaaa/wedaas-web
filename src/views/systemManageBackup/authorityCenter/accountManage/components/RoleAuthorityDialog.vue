<template>
	<el-dialog
		v-model="dialogVisible"
		title="编辑角色权限"
		@open="getRoleList"
		width="530px"
		style="height: 350px"
		class="role-auth-dialog"
	>
		<div class="flex-box">
			<span>角色</span>
			<el-select v-model="dialogProps!.roleId" :loading="roleListLoading" :loading-text="loadingText">
				<el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
			</el-select>
		</div>
		<template #footer>
			<el-button @click="dialogVisible = false">取消</el-button>
			<el-button type="primary" @click="submit">确定</el-button>
			<!-- <el-button @click="check">check</el-button> -->
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";

const dialogVisible = ref(false);
const roleListLoading = ref(true);
const loadingText = ref("获取列表中...");
interface DialogProps {
	// id: number;
	// roleId: number;
	roleId: number | null;
	userId: number;
	api?: (params: any) => Promise<any>;
	getRoleSelectorApi?: () => Promise<any>;
}

const dialogProps = ref<DialogProps>();

const acceptParams = (params: DialogProps) => {
	dialogProps.value = params;
	dialogVisible.value = true;
};

const roleIdChosen = ref();

const roleList = ref<any>([]);
// 请求角色列表
const getRoleList = async () => {
	try {
		// 请求角色列表 并赋值
		// 选择框显示账户角色
		if (dialogProps.value && dialogProps.value.getRoleSelectorApi) {
			const { data } = await dialogProps.value.getRoleSelectorApi!();
			roleList.value = data;
			const matchedRole = findIdInRoleList(dialogProps.value.roleId as number);
			if (matchedRole) {
				roleIdChosen.value = matchedRole.id;
			} else {
				// ElNotification({
				// 	title: "温馨提示",
				// 	message: "账户所属角色不存在，请重新选择角色",
				// 	type: "info",
				// });
				ElMessage.info("账户所属角色不存在，请重新选择角色");
				dialogProps.value.roleId = null;
			}
		}
	} catch (err) {
		console.log(err);
		// ElMessage.error("无法获取角色列表");
	} finally {
		roleListLoading.value = false;
	}
};

const findIdInRoleList = (roleId: number) => {
	const role = roleList.value.find((item: any) => item.id == roleId);
	return role;
};
// 提交
const submit = async () => {
	try {
		let params = { userId: dialogProps.value!.userId, roleId: dialogProps.value!.roleId };
		await dialogProps.value?.api!(params);
		// await
		// ElNotification({
		// 	title: "操作成功",
		// 	message: "修改角色成功!",
		// 	type: "success",
		// });
		ElMessage.success("修改角色权限成功！");
		dialogVisible.value = false;
		emit("refreshData");
	} catch (err) {
		console.log(err);
		// ElNotification({
		// 	title: "操作失败",
		// 	message: "修改角色失败",
		// 	type: "error",
		// });
		// ElMessage.error("修改角色权限失败！");
	}
};

const check = () => {
	console.log(dialogProps.value, roleIdChosen.value);
};
const emit = defineEmits(["refreshData"]);

defineExpose({
	acceptParams,
});
</script>

<style lang="scss">
.el-dialog.role-auth-dialog {
	border-radius: 10px;
	box-shadow: 0 8px 20px 1px rgb(177 197 197 / 8%);
	.el-dialog__header {
		margin-right: 0;
		padding: 30px 28px 0;
		.el-dialog__title {
			font-family: PingFangSC-Regular-, PingFangSC-Regular;
			font-weight: normal;
			font-size: 24px;
			color: #303133;
		}
		.el-dialog__headerbtn {
			top: 16px;
		}
	}
	.el-dialog__body {
		padding: 30px 27px 0;
		.flex-box {
			justify-content: flex-end;
			align-items: center;
			span {
				width: 28px;
				font-family: PingFangSC-Regular-, PingFangSC-Regular;
				font-weight: normal;
				font-size: 14px;
				color: #606266;
			}
			.el-select {
				margin-left: 12px;
				width: 400px;
			}
		}
	}
	.el-dialog__footer {
		position: absolute;
		right: 27px;
		bottom: 29px;
		padding: 0;
		.el-button {
			width: 70px;
			height: 32px;
		}
	}
}
</style>
