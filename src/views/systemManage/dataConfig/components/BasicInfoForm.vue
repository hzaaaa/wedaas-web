<template>
	<div class="basic-info-form-wrapper">
		<el-form
			ref="dataSourceBasicInfoFormRef"
			:model="dataSourceBasicInfoForm"
			:rules="dataSourceBasicInfoFormRules"
			label-width="82px"
			hide-required-asterisk
		>
			<div class="biz-system-row">
				<div class="row-lf">
					<el-form-item label="业务系统" prop="bizSystem">
						<el-input v-model="dataSourceBasicInfoForm.bizSystem" placeholder="请输入业务系统描述"></el-input>
					</el-form-item>
					<el-form-item label="配置元数据" prop="bizSystem" v-if="metadataFormItemEnable">
						<el-select v-model="dataSourceBasicInfoForm.enabled">
							<el-option v-for="item in enabledOptions" :key="item.id" :label="item.name" :value="item.value" />
						</el-select>
					</el-form-item>
				</div>

				<div class="database-img"><SvgIcon :name="databaseIcon" size="48px"></SvgIcon></div>
			</div>

			<div>
				<span>Server</span>
			</div>
			<div>
				<el-form-item label="数据源地址" prop="username">
					<el-input v-model="dataSourceBasicInfoForm.username" maxlength="11"></el-input>
					<!--  @input="dataSourceBasicInfoForm.username = phoneInputReplace(dataSourceBasicInfoForm.username)"  maxlength="11"-->
				</el-form-item>
				<el-form-item label="端口号" prop="nickName">
					<el-input v-model="dataSourceBasicInfoForm.nickName" placeholder="" maxlength="10"></el-input>
				</el-form-item>
			</div>

			<el-form-item label="服务名" prop="roleId">
				<el-input v-model="dataSourceBasicInfoForm.nickName" placeholder="" maxlength="10"></el-input>
			</el-form-item>
			<el-form-item label="Schema" v-if="schemaFormItemEnable">
				<el-input v-model="dataSourceBasicInfoForm.nickName" placeholder="" maxlength="10"></el-input>
			</el-form-item>
			<el-form-item label="驱动版本" prop="enabled">
				<el-select v-model="dataSourceBasicInfoForm.enabled">
					<el-option v-for="item in enabledOptions" :key="item.id" :label="item.name" :value="item.value" />
				</el-select>
			</el-form-item>

			<div>
				<span>认证</span>
			</div>
			<div class="auth-form-item-wrapper">
				<div class="auth-lf">
					<el-form-item label="用户" prop="password" :rules="pwdRuleForm.password">
						<el-input v-model="dataSourceBasicInfoForm.password" placeholder="" maxlength="20" clearable></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="confirmPWD" :rules="pwdRuleForm.confirmPWD">
						<el-input v-model="dataSourceBasicInfoForm.confirmPWD" placeholder="" maxlength="20" clearable></el-input>
					</el-form-item>
					<el-form-item label="principal">
						<el-input v-model="dataSourceBasicInfoForm.confirmPWD" placeholder="" maxlength="20" clearable></el-input>
					</el-form-item>
					<el-form-item label="Krb5 路径">
						<el-input v-model="dataSourceBasicInfoForm.confirmPWD" placeholder="" maxlength="20" clearable></el-input>
					</el-form-item>
				</div>
				<div class="auth-ri" v-if="authFormItemEnable">
					<el-form-item label="认证" prop="confirmPWD" :rules="pwdRuleForm.confirmPWD">
						<el-select v-model="dataSourceBasicInfoForm.enabled">
							<el-option v-for="item in enabledOptions" :key="item.id" :label="item.name" :value="item.value" />
						</el-select>
					</el-form-item>
				</div>
			</div>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { FormInstance, FormRules } from "element-plus";
import mitter from "@/utils/eventBus";
const databaseIcon = ref<any>("");

const enabledOptions = [
	{ id: 1, name: "启用", value: 1 },
	{ id: 2, name: "禁用", value: 0 },
];

const schemaFormItemEnable = ref<any>();
const authFormItemEnable = ref<any>();
const metadataFormItemEnable = ref<any>();
const dataSourceBasicInfoFormRef = ref<FormInstance>();
const dataSourceBasicInfoForm = reactive<any>({
	bizSystem: "",
	username: "",
	nickName: "",
	roleId: null,
	password: "",
	confirmPWD: "",
	enabled: 1,
	roleIdList: [],
	loginClient: 2,
	regionSources: "",
});

const dataSourceBasicInfoFormRules = reactive<FormRules>({
	tenantId: [{ required: true, message: "请选择公司名称", trigger: "change" }],
	// username: [{ required: true, validator: validateMobile, trigger: "blur" }],
	nickName: [{ required: true, message: "请填写用户名", trigger: "change" }],
	roleId: [{ required: true, message: "请选择系统角色", trigger: "change" }],
	// password: [{ required: true, validator: validatePwd, trigger: "blur" }],
	// confirmPWD: [
	//   {
	//     required: true,
	//     validator: (rule: any, value: any, callback: any) => {
	//       validateConfirmPwd(rule, value, callback, dataSourceBasicInfoForm.password);
	//     },
	//     trigger: "blur",
	//   },
	// ],
	regionSources: [{ required: true, message: "请选择承保地区", trigger: "change" }],
	enabled: [{ required: true, message: "请选择状态", trigger: "change" }],
});
const pwdNotRequired = [{ required: false, message: "", trigger: "blur" }];
const confirmPWDNotRequired = [
	{
		required: false,
		message: "",
		trigger: "blur",
	},
];
const pwdRuleForm = reactive<any>({
	password: pwdNotRequired,
	confirmPWD: confirmPWDNotRequired,
});

mitter.on("basicInfo-form-database-icon", (data) => {
	databaseIcon.value = data;
});

mitter.on("basicInfo-form-schema", (data) => {
	schemaFormItemEnable.value = data;
});

mitter.on("basicInfo-form-auth", (data) => {
	authFormItemEnable.value = data;
});

mitter.on("basicInfo-form-meta", (data) => {
	metadataFormItemEnable.value = data;
});
</script>

<style lang="scss" scoped></style>
