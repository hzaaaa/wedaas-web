<template>
	<div class="">
		<el-dialog
			:destroy-on-close="true"
			v-model="dialogVisible"
			title="修改标签名称"
			@open="getLabelInfo"
			width="530px"
			class="common-dialog"
		>
			<el-form ref="inputInfoRef" :model="inputInfo" :rules="rulesForm" label-position="left">
				<el-form-item label="标签名称" prop="name">
					<el-input v-model="inputInfo.name" maxlength="16" show-word-limit placeholder="" />
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
import { updateLabelApi } from "@/api/modules/dataCatalog/labelManage";
const inputInfo = ref({
	name: "",
});
const rulesForm = reactive<any>({
	name: [{ required: true, message: "请输入标签名称!", trigger: "blur" }],
});

const dialogVisible = ref(false);

const dialogProps = ref<any>({
	row: {},
});
let modifyType = <any>null;
const acceptParams = (params: any) => {
	dialogProps.value = params;
	dialogVisible.value = true;
	// debugger;

	inputInfo.value.name = params.row.rootName;
};

const inputInfoRef = <any>ref(null);
// 提交
const submit = async () => {
	let formEl = <FormInstance | undefined>inputInfoRef.value;
	if (!formEl) return;
	formEl.validate(async (valid, fields) => {
		if (valid) {
			let params = <any>{
				id: dialogProps.value.row.rootId,
				labelName: inputInfo.value.name,
			};

			updateLabelApi(params).then((res: any) => {
				ElMessage.success("修改成功！");
				dialogVisible.value = false;
				emit("modifyName", inputInfo.value.name);
			});
		} else {
			console.log("error", fields);
		}
	});
	// dialogVisible.value = false;
	// emit("refreshData");
};
const getLabelInfo = () => {};

const emit = defineEmits(["modifyName"]);

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped></style>
