<template>
	<div class="">
		<el-dialog
			:destroy-on-close="true"
			v-model="dialogVisible"
			title="添加子目录"
			@open="getLabelInfo"
			width="530px"
			class="common-dialog"
		>
			<el-form ref="inputInfoRef" :model="inputInfo" @keyup.enter="submit" :rules="rulesForm" label-position="left">
				<el-form-item label="主目录名称" prop="rootName">
					<el-select v-model="inputInfo.rootName" style="width: 100%">
						<el-option v-for="item in mainCatalogOptions" :key="item.id" :label="item.name" :value="item.name"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="子目录名称" prop="childName">
					<el-input v-model="inputInfo.childName" maxlength="16" show-word-limit placeholder="" />
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
import { addCatalogApi } from "@/api/modules/dataCatalog/dataCatalog";
const inputInfo = ref({
	rootName: "",
	childName: "",
});
const rulesForm = reactive<any>({
	rootName: [{ required: true, message: "请输入主目录名称!", trigger: "blur" }],
	childName: [{ required: true, message: "请输入子目录名称!", trigger: "blur" }],
});

const dialogVisible = ref(false);

const dialogProps = <any>ref({
	row: {
		list: [],
	},
});

const mainCatalogOptions = <any>ref([]);
const acceptParams = (params: any) => {
	dialogProps.value = params;
	dialogVisible.value = true;

	mainCatalogOptions.value = params.row.list;
	inputInfo.value.rootName = params.row.name;
	inputInfo.value.childName = "";
};

const inputInfoRef = <any>ref(null);
// 提交
const submit = async () => {
	let formEl = <FormInstance | undefined>inputInfoRef.value;
	if (!formEl) return;
	formEl.validate(async (valid, fields) => {
		if (valid) {
			addCatalogApi({ ...inputInfo.value }).then((res: any) => {
				ElMessage.success("添加成功！");
				dialogVisible.value = false;
				emit("refreshData");
			});
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
