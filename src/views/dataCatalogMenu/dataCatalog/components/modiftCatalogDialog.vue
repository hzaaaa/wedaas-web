<template>
	<div class="">
		<el-dialog v-model="dialogVisible" title="修改目录名称" @open="getLabelInfo" width="530px" class="common-dialog">
			<el-form ref="inputInfoRef" :model="inputInfo" :rules="rulesForm" label-position="left">
				<el-form-item label="目录名称" prop="name">
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

const inputInfo = ref({
	name: "",
});
const rulesForm = reactive<any>({
	name: [{ required: true, message: "请输入目录名称!", trigger: "blur" }],
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
		} else {
			console.log("error", fields);
		}
	});
	// dialogVisible.value = false;
	// emit("refreshData");
};
const getLabelInfo = () => {};

const emit = defineEmits(["refreshData"]);

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped></style>
