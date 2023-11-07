<template>
	<div class="exploration-setting-wrapper">
		<div class="basic-setting-wrapper">
			<div class="header">
				<div>
					<el-icon><ArrowLeft /></el-icon><span>返回</span>
				</div>

				<div class="setting-field">cfx_dingsun —— ods_cfx_admin_company_full —— dt</div>
			</div>
			<span>基础设置</span>
			<el-divider />
			<div class="basic-setting-item">
				<el-select v-model="value" placeholder="">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-checkbox v-model="checked1" label="空值" />
				<el-checkbox v-model="checked2" label="唯一值" />
				<el-checkbox v-model="checked3" label="众数" />
				<el-checkbox v-model="checked4" label="数值统计" v-if="value == 'Option1'" />
				<el-checkbox v-model="checked5" label="时间分段" v-if="value == 'Option4'" />
			</div>
		</div>
		<div class="advanced-setting-wrapper">
			<div class="header">
				<span>高级设置</span>
				<el-button type="warning" icon="Plus" @click="openAddEditAdvancedSettingDialog('')">添加探查项</el-button>
			</div>
			<div class="app-log-table-wrapper">
				<el-table
					v-loading="tableLoading"
					:data="tableDataList"
					cell-class-name="table-cell"
					header-cell-class-name="header-cell"
					class="common-table"
					height="100%"
					border
				>
					<el-table-column label="探查" prop="desc" />

					<el-table-column label="条件" prop="tableName"> </el-table-column>
					<el-table-column label="表达式" prop="tableName"> </el-table-column>
					<el-table-column label="操作">
						<template #default="scope">
							<el-button type="primary" icon="Edit" link @click="openAddEditAdvancedSettingDialog(scope.row)"></el-button>
							<el-button type="primary" icon="Delete" link @click="deleteAccount(scope.row)"></el-button
						></template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
	<AddEditAdvancedSettingDialog ref="addEditAdvancedSettingDialogRef" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import useListPageHook from "@/hooks/listPage";
import { getAPIConfigAPi } from "@/api/modules/mock/mock";
import { ElMessage, ElMessageBox } from "element-plus";
import AddEditAdvancedSettingDialog from "../components/AddEditAdvancedSettingDialog.vue";

const value = ref("");

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

const checked1 = ref(true);
const checked2 = ref(true);
const checked3 = ref(true);
const checked4 = ref(true);
const checked5 = ref(true);

// 编辑基本信息弹窗
const addEditAdvancedSettingDialogRef = ref<InstanceType<typeof AddEditAdvancedSettingDialog> | null>(null);
const openAddEditAdvancedSettingDialog = (info: any) => {
	const params = {
		info: info,
	};
	addEditAdvancedSettingDialogRef.value?.acceptParams(params);
};

const deleteAccount = (row: any) => {
	ElMessageBox.confirm("此操作将永久删除该用户, 是否继续?", `提示`, {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		customClass: "delete-message",
	})
		.then(async () => {
			try {
				// await postCustomerAccountDeletionApi({ id: row.id });
				// ElMessage.success("删除成功");
				// refreshData();
			} catch (err) {
				console.error(err);
			}
		})
		.catch(() => {
			ElMessage.info("取消删除");
		});
};
const queryFormRaw = {
	name: "",
};

const beanInfo = {};
let {
	tableLoading,
	pageParams,
	tableDataList,
	handleCurrentPageChange,
	handleSizeChange,
	resetPageToOne,
	refreshData, //刷新按钮

	drawer,
	employeeRow,
	onAddDrawer,
	onEditDrawer,
	searchByQueryForm,
	subData,

	queryForm,
	doReset,
} = useListPageHook(
	// getCompanyListApi,
	getAPIConfigAPi, //temp test

	beanInfo,
	queryFormRaw
);
</script>

<style lang="scss" scoped>
@import "./index";
</style>
