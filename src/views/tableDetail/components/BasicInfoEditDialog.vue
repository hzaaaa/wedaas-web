<template>
	<el-dialog title="属性编辑" class="basic-info-dialog" v-model="dialogVisible" @open="open" @close="close">
		<el-form :model="dialogProps" ref="basicInfoFormRef" hide-required-asterisk>
			<el-form-item label="描述">
				<el-input v-model="dialogProps.info.tableDesp"></el-input>
			</el-form-item>
			<el-form-item label="业务定义">
				<el-input v-model="dialogProps.info.businessDefine"></el-input>
			</el-form-item>
			<el-form-item label="IT负责人">
				<el-input v-model="dialogProps.info.itOwner"></el-input>
			</el-form-item>
			<el-form-item label="业务主体部门">
				<el-input v-model="dialogProps.info.businessDepartment"></el-input>
			</el-form-item>
			<el-form-item label="备注">
				<el-input v-model="dialogProps.info.comment"></el-input>
			</el-form-item>
			<el-form-item label="新增标签">
				<el-select v-model="dialogProps.info.tag" placeholder="" clearable style="width: 100%">
					<el-option v-for="(item, index) in dataLabelListOptions" :key="index" :label="item.b" :value="item.b" />
				</el-select>
				<div class="tags-wrapper">
					<div>已有标签：</div>
					<el-tag type="info" v-for="(item, index) in dialogProps.info.lables" :key="index" style="margin-right: 5px">{{
						item
					}}</el-tag>
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="updateTableInfo(dialogProps.info)"> 确定 </el-button>
				<!-- <el-button type="primary" @click="check"> check </el-button> -->
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import {} from "vue";
import { FormInstance, FormRules } from "element-plus";
import { postTableInfoUpdateApi, postLabelAdditionApi } from "@/api/modules/tableInfo/tableInfo";
import { getLabelListApi } from "@/api/modules/advancedSearch/searchFilter";

const dialogVisible = ref(false);
const open = () => {
	getLabelListOptions();
};

const close = () => {
	dialogProps.value.info = "";
};
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

const dataLabelListOptions = ref<any>([]);
// 获取数据标签

const getLabelListOptions = async () => {
	try {
		const { data } = await getLabelListApi();
		dataLabelListOptions.value = data;
	} catch (err) {
		console.error(err);
	}
};

const basicInfoFormRef = ref<FormInstance>();

const updateTableInfo = async (basicInfo: any) => {
	try {
		let params = {
			businessDefine: basicInfo.businessDefine,
			businessDepartment: basicInfo.businessDepartment,
			comment: basicInfo.comment,
			itOwner: basicInfo.itOwner,
			labelList: [],
			tableDesp: basicInfo.tableDesp,
			tableId: basicInfo.tableId,
			tag: basicInfo.tag ? basicInfo.tag : "",
		};
		console.log(params);
		await postTableInfoUpdateApi(params);
		if (params.tag.length) await addLabel({ label: params.tag, table_list: params.tableId });
		dialogVisible.value = false;
		emit("updateInfo");
	} catch (err) {
		console.error(err);
	}
};

const addLabel = async (params: any) => {
	try {
		await postLabelAdditionApi(params);
	} catch (err) {
		console.error(err);
	}
};
const check = () => {
	console.log(dialogProps.value.info);
};

// interface TableDetailEmits {
// 	(e: "updateInfo", value: any): void;
// }
const emit = defineEmits(["updateInfo"]);
defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped></style>
