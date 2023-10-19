<template>
	<el-dialog title="属性编辑" class="basic-info-dialog" v-model="dialogVisible">
		<el-form :model="dialogProps" ref="basicInfoFormRef" hide-required-asterisk>
			<el-form-item label="描述">
				<el-input v-model="dialogProps.info.item"></el-input>
			</el-form-item>
			<el-form-item label="业务负责人">
				<el-input v-model="dialogProps.info.item"></el-input>
			</el-form-item>
			<el-form-item label="IT负责人">
				<el-input v-model="dialogProps.info.item"></el-input>
			</el-form-item>
			<el-form-item label="业务主体部门">
				<el-input v-model="dialogProps.info.item"></el-input>
			</el-form-item>
			<el-form-item label="备注">
				<el-input v-model="dialogProps.info.item"></el-input>
			</el-form-item>
			<el-form-item label="新增标签">
				<el-select v-model="dialogProps.info.tag" placeholder="" clearable>
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="dialogVisible = false"> 确定 </el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import {} from "vue";
import { FormInstance, FormRules } from "element-plus";
const dialogVisible = ref(false);

interface DialogProps {
	info: any;
	// api?: (params: any) => Promise<any>;
}

const dialogProps = ref<DialogProps>({
	info: "",
});

const acceptParams = (params: DialogProps) => {
	console.log(params);
	dialogProps.value = params;
	dialogVisible.value = true;
};

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

const basicInfoFormRef = ref<FormInstance>();

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped></style>
