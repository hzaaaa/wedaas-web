<template>
	<div class="">
		<el-dialog
			:destroy-on-close="true"
			v-model="dialogVisible"
			title="保存"
			@open="getLabelInfo"
			width="530px"
			class="common-dialog"
		>
			<el-form ref="inputInfoRef" :model="inputInfo" @keyup.enter="submit" :rules="rulesForm" label-position="left">
				<el-form-item label="文件名称" prop="filename">
					<el-input v-model="inputInfo.filename" maxlength="16" show-word-limit placeholder="" />
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
import { ref } from "vue";
import { ElMessage, type FormInstance, type FormRules, type TabsPaneContext } from "element-plus";
import { saveQueryStrApi } from "@/api/modules/sqlQuery/index";
const inputInfo = ref({
	filename: "",
});
const rulesForm = reactive<any>({
	filename: [{ required: true, message: "请输入文件名称!", trigger: "blur" }],
});

const dialogVisible = ref(false);

const dialogProps = ref<any>({});

const acceptParams = (params: any) => {
	dialogProps.value = params;
	dialogVisible.value = true;
};

const inputInfoRef = <any>ref(null);
// 提交
const submit = async () => {
	let formEl = <FormInstance | undefined>inputInfoRef.value;
	if (!formEl) return;
	formEl.validate(async (valid, fields) => {
		if (valid) {
			let params = {
				...dialogProps.value,
				...inputInfo.value,
			};
			saveQueryStrApi(params).then((res: any) => {
				ElMessage.success("保存文件成功！");
				dialogVisible.value = false;
				// 	emit("refreshData");
			});
			// addCatalogApi({ ...inputInfo.value }).then((res: any) => {
			// 	ElMessage.success("保存文件成功！");
			// 	dialogVisible.value = false;
			// 	emit("refreshData");
			// });
		} else {
			console.log("error", fields);
		}
	});
};
const getLabelInfo = () => {};

const emit = defineEmits(["refreshData"]);

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped></style>
