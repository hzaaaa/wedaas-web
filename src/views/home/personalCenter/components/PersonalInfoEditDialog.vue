<template>
	<el-dialog title="个人信息设置" class="personal-info-edit-dialog" v-model="dialogVisible">
		<el-form :model="personalInfoForm" ref="personalInfoFormRef" hide-required-asterisk>
			<el-form-item label="用户名">
				<el-input v-model="userStore.userInfoGet.username" disabled></el-input>
			</el-form-item>
			<el-form-item label="角色">
				<el-input v-model="userStore.userRoleGet.name" disabled></el-input>
			</el-form-item>
			<el-form-item label="邮箱">
				<el-input v-model="personalInfoForm.email"></el-input>
			</el-form-item>
			<el-form-item label="原密码">
				<el-input v-model="personalInfoForm.oldPwd"></el-input>
			</el-form-item>
			<el-form-item label="新密码">
				<el-input v-model="personalInfoForm.newPwd"></el-input>
			</el-form-item>
			<el-form-item label="确认密码">
				<el-input v-model="personalInfoForm.confirmPwd"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">重置</el-button>
				<el-button type="primary" @click="dialogVisible = false"> 确定 </el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import {} from "vue";
import { FormInstance, FormRules } from "element-plus";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const dialogVisible = ref(false);

interface DialogProps {
	info: any;
	// api?: (params: any) => Promise<any>;
}

const dialogProps = ref<DialogProps>({
	info: "",
});

const acceptParams = (params: DialogProps) => {
	console.log(params);
	dialogProps.value = params;
	dialogVisible.value = true;
};

const personalInfoFormRef = ref<FormInstance>();

const personalInfoForm = reactive({
	email: userStore.userInfoGet.email,
	oldPwd: "",
	newPwd: "",
	confirmPwd: "",
});

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped></style>
