<template>
	<div class="">
		<el-dialog
			:destroy-on-close="true"
			v-model="dialogVisible"
			title="添加主目录"
			@open="getLabelInfo"
			width="530px"
			class="common-dialog"
		>
			<el-form @keyup.enter="submit" ref="inputInfoRef" :model="inputInfo" :rules="rulesForm" label-position="left">
				<el-form-item label="主目录名称" prop="rootName">
					<el-input v-model="inputInfo.rootName" maxlength="16" show-word-limit placeholder="" />
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
import { addApiCatalogApi } from "@/api/modules/dataApi/apiCatalog";
const inputInfo = ref({
	rootName: "",
});
const rulesForm = reactive<any>({
	rootName: [{ required: true, message: "请输入主目录名称!", trigger: "blur" }],
});

const dialogVisible = ref(false);

const dialogProps = ref<any>({
	row: {
		status: 0,
	},
});

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
			addApiCatalogApi({ ...inputInfo.value }).then((res: any) => {
				ElMessage.success("添加成功！");
				dialogVisible.value = false;
				emit("refreshData");
			});
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
