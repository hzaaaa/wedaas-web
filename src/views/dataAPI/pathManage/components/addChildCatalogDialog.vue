<template>
	<div class="">
		<el-dialog v-model="dialogVisible" title="添加API路径" @open="getLabelInfo" width="530px" class="common-dialog">
			<el-form ref="inputInfoRef" :model="inputInfo" :rules="rulesForm" label-position="left">
				<el-form-item label="主路径名称" prop="mainName">
					<!-- <el-input v-model="inputInfo.mainName" maxlength="16" show-word-limit placeholder="" /> -->
					<!-- <el-select ></el-select> -->
					<el-select v-model="inputInfo.mainName" style="width: 100%">
						<el-option
							v-for="item in [
								{
									name: 'name',
									id: '1',
								},
							]"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="子路径名称" prop="childName">
					<el-input v-model="inputInfo.childName" placeholder="" />
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
	mainName: "",
	childName: "",
});
const rulesForm = reactive<any>({
	mainName: [{ required: true, message: "请输入主目录名称!", trigger: "blur" }],
	childName: [{ required: true, message: "请输入子目录名称!", trigger: "blur" }],
});

const dialogVisible = ref(false);

const dialogProps = <any>ref({
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
