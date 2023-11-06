<template>
	<div class="">
		<el-dialog
			:destroy-on-close="true"
			v-model="dialogVisible"
			:title="`${dialogProps.title}正则配置`"
			width="530px"
			class="common-dialog"
		>
			<el-form
				ref="inputInfoRef"
				:model="inputInfo"
				@keyup.enter="submit"
				:rules="rulesForm"
				label-position="left"
				label-width="auto"
			>
				<el-form-item label="正则名称" prop="regularName">
					<el-input v-model="inputInfo.regularName" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="描述" prop="regularDescription">
					<el-input v-model="inputInfo.regularDescription" placeholder="请输入" />
				</el-form-item>
				<el-form-item label="正则表达式" prop="regularExpression">
					<el-input v-model="inputInfo.regularExpression" type="textarea" :rows="5" placeholder="请输入" />
				</el-form-item>
			</el-form>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submit">确定</el-button>
				<!-- <el-button @click="check">check</el-button> -->
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, type FormInstance, type FormRules, type TabsPaneContext } from "element-plus";
import { insertUserRegularApi, updateUserRegularApi } from "@/api/modules/dataQuality/explorationConfig";
let inputInfoRaw = {
	regularName: "",
	regularDescription: "",
	regularExpression: "",
};
const inputInfo = <any>ref(inputInfoRaw);
const rulesForm = reactive<any>({
	regularName: [{ required: true, message: "请输入正则名称!", trigger: "blur" }],
	regularDescription: [{ required: true, message: "请输入相关描述!", trigger: "blur" }],
	regularExpression: [{ required: true, message: "请输入正则表达式!", trigger: "blur" }],
});

const dialogVisible = ref(false);

const dialogProps = <any>ref({
	title: "", //新增 or 修改
	row: {},
});

const acceptParams = (params: any) => {
	dialogProps.value = params;
	if (dialogProps.value.title === "修改") {
		let { regularName, regularDescription, regularExpression, id } = params.row;
		inputInfo.value = {
			regularName,
			regularDescription,
			regularExpression,
			id,
		};
	} else {
		inputInfo.value = { ...inputInfoRaw };
	}
	// debugger;
	dialogVisible.value = true;
};

const inputInfoRef = <any>ref(null);
// 提交
const submit = async () => {
	let formEl = <FormInstance | undefined>inputInfoRef.value;
	if (!formEl) return;
	formEl.validate(async (valid, fields) => {
		if (valid) {
			let api = <any>null;
			let params = <any>{ ...inputInfo.value };
			if (dialogProps.value.title === "新增") {
				api = insertUserRegularApi;
				delete params.id;
			} else if (dialogProps.value.title === "修改") {
				api = updateUserRegularApi;
			}
			console.log("params", params);
			api(params).then(() => {
				if (dialogProps.value.title === "新增") {
					ElMessage.success("添加成功！");
				} else {
					ElMessage.success("修改成功！");
				}
				dialogVisible.value = false;
				emit("refreshData");
			});
		} else {
			console.log("error", fields);
		}
	});
};

const emit = defineEmits(["refreshData"]);

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped></style>
