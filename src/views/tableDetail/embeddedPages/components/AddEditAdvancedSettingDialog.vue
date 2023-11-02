<template>
	<el-dialog title="新增" class="advanced-setting-dialog" v-model="dialogVisible">
		<el-radio-group v-model="radio1" class="ml-4">
			<el-radio label="1" size="large">自定义</el-radio>
			<el-radio label="2" size="large">预置</el-radio>
		</el-radio-group>
		<div class="exploration-item">
			<span>{{ radio1 == "1" ? "正则匹配" : "数据类型" }}</span>
			<div class="custom-item" v-if="radio1 == '1'">
				<el-input v-model="input" placeholder="请输入" v-if="!chooseRegExp"></el-input>
				<el-select v-model="value" placeholder="" v-else>
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button type="primary" @click="chooseRegExp = !chooseRegExp">{{ `${!chooseRegExp ? "选择" : "新增"}正则` }}</el-button>
			</div>
			<div class="preset-item" v-else>
				<el-select v-model="value" placeholder="">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</div>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="dialogVisible = false"> 添加 </el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
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

const radio1 = ref("1");
const input = ref("");

const value = ref("");

const options = [
	{
		value: "Option1",
		label: "Option1",
	},
	{
		value: "Option2",
		label: "Option2",
	},
	{
		value: "Option3",
		label: "Option3",
	},
	{
		value: "Option4",
		label: "Option4",
	},
	{
		value: "Option5",
		label: "Option5",
	},
];

const chooseRegExp = ref(false);

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
