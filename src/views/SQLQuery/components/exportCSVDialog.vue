<template>
	<div class="">
		<el-dialog
			:destroy-on-close="true"
			v-model="dialogVisible"
			title="导出"
			@open="getLabelInfo"
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
				<el-form-item label=" " prop="">
					<el-radio-group v-model="inputInfo.type">
						<el-radio label="rowNumber">行数</el-radio>
						<el-radio label="all">全部</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="导出行数" prop="rootName" v-show="inputInfo.type === 'rowNumber'">
					<el-input v-model="inputInfo.rootName" show-word-limit placeholder="" />
				</el-form-item>
				<el-form-item label="分隔符" prop="rootName">
					<el-input v-model="inputInfo.rootName" show-word-limit placeholder="" />
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
// import { saveQueryStrApi } from "@/api/modules/sqlQuery/index";
const inputInfo = ref({
	rootName: "",
	type: "rowNumber", //rowNumber or all
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
			// saveQueryStrApi({}).then((res: any) => {});
			// addCatalogApi({ ...inputInfo.value }).then((res: any) => {
			// 	ElMessage.success("添加成功！");
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
