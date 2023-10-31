<template>
	<el-form
		ref="loginFormRef"
		:model="loginForm"
		label-position="top"
		:rules="loginFormRules"
		:hide-required-asterisk="true"
		style="min-width: 260px"
		@keyup.enter="login(loginFormRef)"
	>
		<el-form-item label="账户" prop="username">
			<el-input v-model="loginForm.username" placeholder=""></el-input>
		</el-form-item>
		<el-form-item label="密码" prop="password">
			<el-input v-model="loginForm.password" placeholder="" type="password"></el-input>
		</el-form-item>
		<!-- <el-form-item label="验证码" prop="code" class="captcha">
			 

			<el-input v-model="loginForm.code" placeholder="请输入验证码">
				<template #append>
					<el-tooltip effect="dark" content="点击刷新验证码" placement="right" transition="fade-in-linear"
						><img class="login-captcha" :src="captcha.img" @click="getCaptcha()" />
					</el-tooltip>
				</template>
			</el-input>
		</el-form-item> -->
	</el-form>
	<div class="login-btn">
		<el-button @click="login(loginFormRef)" type="primary">登录</el-button>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount } from "vue";
import { Login } from "@/api/interface";
import { loginApi, getCaptchaApi, checkOrgIpApi } from "@/api/modules/login";
import { AuthStore } from "@/stores/modules/auth";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { HOME_URL } from "@/config/config";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
// import { Base64 } from "js-base64";
import loginResult from "@/assets/json/loginResult.json";
import Cookie from "js-cookie";

const authStore = AuthStore();
const router = useRouter();
const userStore = useUserStore();

const loginFormRef = ref<FormInstance>();
const loginForm = reactive<Login.ReqLoginForm>({
	username: "",
	password: "",
	type: 1,
	captchaId: "",
	code: "",
});

const loginFormRules = reactive<FormRules>({
	username: [{ required: true, message: "请输入用户名！", trigger: "blur" }],
	password: [{ required: true, message: "请输入密码！", trigger: "blur" }],
	code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
});

interface CaptchaProps {
	captchaId: string;
	img: string;
}

let captcha = reactive<CaptchaProps>({
	captchaId: "",
	img: "",
});

const getCaptcha = async () => {
	// const { data } = await getCaptchaApi();
	const { data } = {
		data: {
			captchaId: "05a7320a3c7f4da1acdf980d9ecfa0ef",
			img: "data:image/png;base64,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",
		},
	};
	loginForm.captchaId = captcha.captchaId = data.captchaId;
	captcha.img = data.img;
};

const login = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (!valid) return;
		// const res = await checkOrgIpApi({ username: loginForm.username });
		// if (!res.data === true) {
		// 	console.log("ip错误");
		// 	ElMessage.error("IP地址未添加，请联系管理员！");
		// 	return;
		// }
		try {
			const { data } = await (<any>loginApi(loginForm));
			console.log(data);
			// debugger;
			data.menuVoList = loginResult.data.userInfoVo.menuVoList;
			// userStore.setToken(Base64.encode(data.token));
			userStore.setToken(data.token);
			userStore.setUserInfo(data);
			userStore.setId(data.id);
			userStore.setUserName(data.username);
			// debugger;
			authStore.setAuthOriginMenuList(data.menuVoList);

			// debugger;
			// 检查ip
			await initDynamicRouter();
			// await authStore.getAuthButtonList();//temp test
			router.push({ path: HOME_URL });

			// router.push({ path: '/userAccount/basicInfo' });
		} catch (err) {
			console.warn(err);
		}
	});
};

onBeforeMount(() => {
	getCaptcha();
});
</script>

<style lang="scss" scoped>
@import "../index";
</style>
