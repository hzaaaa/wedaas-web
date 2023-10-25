<template>
	<div class="card personal-center-card">
		<div class="personal-info-wrapper">
			<el-avatar size="large" class="personal-avatar">{{ userStore.username.charAt(0) }}</el-avatar>
			<div class="personal-info">
				<span>{{ userStore.username }}</span>
				<el-divider direction="vertical" />
				<div @click="openPersonalInfoEditDialog(userStore?.userInfo?.avatarUrl)">
					<el-icon><Edit /></el-icon><span>个人设置</span>
				</div>
			</div>
			<span class="welcome-text">{{ `欢迎使用，${userStore.username}` }}</span>
		</div>
		<el-tabs v-model="activeName" @tab-click="handleTabClick">
			<el-tab-pane label="我的收藏" name="myCollection">
				<MyCollection ref="myCollectionRef" />
				<!-- <div class="myCollection-wrapper">
					<div>
						<span>头像</span><el-avatar :src="userStore.userInfoGet.avatarUrl"></el-avatar>
						<el-button type="primary" link>修改</el-button>
					</div>
					<div>
						<span>用户名</span>
						{{ userStore.username }}
					</div>
					<div>
						<span>姓名</span>
						{{ userStore.userInfoGet.nickName ? userStore.userInfoGet.nickName : "" }}
					</div>
					<div>
						<span>联系方式</span>
						{{ userStore.userInfoGet.phone ? userStore.userInfoGet.phone : "" }}
					</div>
					<div>
						<span>邮箱</span>
						{{ userStore.userInfoGet.email ? userStore.userInfoGet.email : "" }}
					</div>
				</div> -->

				<!-- <el-button type="primary" @click="check">check</el-button> -->
			</el-tab-pane>
			<el-tab-pane label="我的保存" name="mySave">
				<!-- <el-form ref="editPasswordFormRef" :model="editPasswordForm" :rules="editPasswordFormRules" label-width="94px">
					<el-form-item label="原密码：" prop="oldPassword">
						<el-input v-model="editPasswordForm.oldPassword"></el-input>
					</el-form-item>
					<el-form-item label="新密码：" prop="newPassword">
						<el-input v-model="editPasswordForm.newPassword"></el-input>
					</el-form-item>
					<el-form-item label="确认密码：" prop="confirmPassword">
						<el-input v-model="editPasswordForm.confirmPassword"></el-input>
					</el-form-item>
					<el-form-item style="margin-top: 140px">
						<el-button type="primary" @click="editPwd(editPasswordFormRef)">修改</el-button>
					</el-form-item>
				</el-form> -->
				<MySave ref="mySaveRef" />
			</el-tab-pane>
		</el-tabs>
		<PersonalInfoEditDialog ref="personalInfoEditDialogRef" />
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { FormInstance, FormRules, TabsPaneContext } from "element-plus";
import PersonalInfoEditDialog from "./components/PersonalInfoEditDialog.vue";
import MyCollection from "./components/MyCollection.vue";
import MySave from "./components/MySave.vue";
import { useUserStore } from "@/stores/user";
import { postUserPwdEdition } from "@/api/modules/user/userCenter";
import { ElMessage } from "element-plus";
import { validateConfirmPwd, validatePwd } from "@/utils/validator";

const userStore = useUserStore();
const activeName = ref("myCollection");

const handleTabClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event);
	// if (tab.paneName == "myCollection")
};

const myCollectionRef = ref<InstanceType<typeof MyCollection> | null>(null);

const mySaveRef = ref<InstanceType<typeof MySave> | null>(null);

const editPasswordFormRef = ref<FormInstance>();
const editPasswordForm = reactive({
	oldPassword: "",
	newPassword: "",
	confirmPassword: "",
});

const editPasswordFormRules = reactive<FormRules>({
	oldPassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
	newPassword: [{ required: true, validator: validatePwd, trigger: "blur" }],
	confirmPassword: [
		{
			required: true,
			validator: (rule: any, value: any, callback: any) => {
				validateConfirmPwd(rule, value, callback, editPasswordForm.newPassword);
			},
			trigger: "blur",
		},
	],
});

const buttonLoading = ref(false);
// 修改密码
const editPwd = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (!valid) {
			ElMessage({
				type: "error",
				message: "请填入正确的信息！",
			});
			return;
		}

		buttonLoading.value = true;
		try {
			const params = {
				oldPwd: editPasswordForm.oldPassword,
				newPwd: editPasswordForm.newPassword,
			};
			await postUserPwdEdition(params);
			ElMessage.success("修改密码成功！");
		} catch (err: any) {
			console.log(err);
		} finally {
			buttonLoading.value = false;
		}
	});
};

// // 编辑头像弹窗
// const avatarEditDialogRef = ref<InstanceType<typeof AvatarEditDialog> | null>(null);
// const openAvatarEditDialog = (imgUrl: string) => {
// 	const params = {
// 		imgUrl: imgUrl,
// 	};
// 	avatarEditDialogRef.value?.acceptParams(params);
// };

const check = () => {
	console.log(userStore.userInfoGet);
	console.log(userStore.username);
};

// 编辑基本信息弹窗
const personalInfoEditDialogRef = ref<InstanceType<typeof PersonalInfoEditDialog> | null>(null);
const openPersonalInfoEditDialog = (info: any) => {
	const params = {
		info: info,
	};
	personalInfoEditDialogRef.value?.acceptParams(params);
};

const handleDoSomething = (data: any) => {
	console.log("监听到子组件生命周期钩子函数mounted时，触发该回调", data);
};
// onMounted(() => {
// 	myCollectionRef.value?.searchByQueryForm();
// });
</script>

<style lang="scss" scoped>
@import "./index";
</style>
