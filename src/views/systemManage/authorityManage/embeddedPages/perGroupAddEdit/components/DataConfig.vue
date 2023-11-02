<template>
	<div class="common-layout-system">
		<el-form :model="queryForm" class="table-header-form">
			<el-button
				icon="Operation"
				text
				@click="allSelected = !allSelected"
				:class="[allSelected ? 'all-selected' : '', 'all-selected-btn']"
				>全部</el-button
			>
			<el-form-item label="选择数据库">
				<el-select v-model="queryForm.table" class="m-2" placeholder="Select" size="large">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="">
				<el-select v-model="queryForm.table1" class="m-2" placeholder="Select" size="large">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="搜索表">
				<el-input v-model="value" suffix-icon="search" placeholder="请输入"></el-input>
			</el-form-item>
			<el-checkbox v-model="checkSelected" :label="`查看已勾选（${selectedList.length}）`" @change="filterSelected"></el-checkbox>
		</el-form>
		<div class="operat-buttons">
			<!-- <span>新增用户</span>
			<el-checkbox
				v-model="checkSelected"
				:label="`查看已勾选（${props.submitForm.selectedUser ? props.submitForm.selectedUser.length : 0}）`"
				@change="filterSelected"
			></el-checkbox> -->
			<!-- <el-button type="warning" v-permission="['roleManage:add']" icon="Plus" @click="openOrgDrawer('新建')">新建</el-button> -->
			<!-- <div class="space"></div> -->
		</div>

		<div class="table-wrapper">
			<el-table
				ref="table"
				v-loading="tableLoading"
				:data="newTableDataList"
				cell-class-name="table-cell"
				header-cell-class-name="header-cell"
				class="common-table"
				show-overflow-tooltip
				show-header
			>
				<el-table-column label="表名" prop="tableName"> </el-table-column>
				<el-table-column label="数据源" prop="dataSourceName"> </el-table-column>
				<el-table-column label="数据库" prop="dataCatalog"> </el-table-column>
				<el-table-column label="描述" prop="desc"> </el-table-column>
				<el-table-column>
					<template #header>
						<div>
							<el-checkbox
								v-model="view"
								label="权限"
								size="large"
								:indeterminate="isIndeterminate"
								@change="(val: any) => handleSelectedFn(val, 'view')"
								ref="viewCheckBoxRef"
							/>
							<el-checkbox
								v-model="all"
								label="权限"
								size="large"
								:indeterminate="isIndeterminate1"
								@change="(val: any) => handleSelectedFn(val, 'all')"
								ref="allCheckBoxRef"
							/>
						</div>
					</template>
					<template #default="scope">
						<el-checkbox
							v-model="scope.row.view"
							label="查看"
							size="large"
							@change="(val: any) =>handleListSelectedFn(val, 'view', scope) "
						/>
						<el-checkbox
							v-model="scope.row.all"
							label="全部"
							size="large"
							@change="(val: any) =>handleListSelectedFn(val, 'all',  scope) "
						/>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<div class="pagination-block">
			<slot name="operate-btn"></slot>
			<el-pagination
				:total="pageParams.total"
				:current-page="pageParams.pageNum"
				:page-size="pageParams.pageSize"
				@current-change="handleCurrentPageChange"
				layout="slot, prev, pager, next, jumper"
				background
			>
				<span class="pagi-slot">{{ `找到 ${pageParams.total} 结果` }}</span>
			</el-pagination>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import useListPageHook from "@/hooks/listPage";
import { getMySaveListApi } from "@/api/modules/mock/mock";
import { useRoute, useRouter } from "vue-router";
import type { ElTable, ElTableColumn, ElCheckbox } from "element-plus";

const router = useRouter();
const checkSelected = ref(false);

const allSelected = ref(false);

const selectedList = ref([]);

let props = defineProps(["submitForm"]);

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
const table = ref<InstanceType<typeof ElTable> | null>(null);

const view = ref(false);
const all = ref(false);

const viewCheckBoxRef = ref<InstanceType<typeof ElCheckbox> | null>(null);
const allCheckBoxRef = ref<InstanceType<typeof ElCheckbox> | null>(null);

const isIndeterminate = ref(false);
const isIndeterminate1 = ref(false);

// 表头全选框

const handleSelectedFn = (val: any, selectionValue: any) => {
	const currentValue = val;
	console.log(val);

	for (let i = 0; i < newTableDataList.value.length; i++) {
		newTableDataList.value[i][selectionValue] = currentValue;
	}
	if (val && selectionValue == "view") {
		// if (allCheckBoxRef.value) allCheckBoxRef.value.onChange(false);
		all.value = false;
		isIndeterminate1.value = false;
		handleSelectedFn(false, "all");
	} else if (val && selectionValue == "all") {
		view.value = false;
		isIndeterminate.value = false;
		handleSelectedFn(false, "view");
	}

	if (val) {
		selectedList.value = newTableDataList.value;
	} else {
		selectedList.value = [];
	}
	if (selectionValue == "view") isIndeterminate.value = false;

	if (selectionValue == "all") isIndeterminate1.value = false;
};

const handleListSelectedFn = (val: any, selectionValue: any, scope: any) => {
	// 点击table列表内的选择框
	// table列表内选择框状态改变
	// this.tableData[scope.$index][selectionValue] = !this.tableData[scope.$index][selectionValue];
	let checkBoxChanged: string;
	if (selectionValue == "view") {
		checkBoxChanged = "all";
	} else {
		checkBoxChanged = "view";
	}
	if (val && newTableDataList.value[scope.$index][checkBoxChanged]) {
		newTableDataList.value[scope.$index][checkBoxChanged] = false;
	}
	// console.log(newTableDataList.value.some((item: any) => item[checkBoxChanged] === true));

	if (newTableDataList.value.some((item: any) => item[checkBoxChanged] === true)) {
		if (checkBoxChanged == "view") {
			isIndeterminate.value = true;
		} else if (checkBoxChanged == "all") {
			isIndeterminate1.value = true;
		}
	} else {
		if (checkBoxChanged == "view") {
			view.value = false;
			isIndeterminate.value = false;
		} else if (checkBoxChanged == "all") {
			all.value = false;
			isIndeterminate1.value = false;
		}
	}

	selectedList.value = newTableDataList.value.filter(
		(item: any) => item[selectionValue] == true || item[checkBoxChanged] == true
	);
	// 判断是否在全选状态下
	let statusSelected = allSelectionFn(selectionValue);
	// console.log("statusSelected: ", statusSelected);
	if (statusSelected) {
		// 列表全部被选中,头部变更为选中状态
		if (selectionValue == "view") {
			view.value = true;
			isIndeterminate.value = false;
		} else if (selectionValue == "all") {
			all.value = true;
			isIndeterminate1.value = false;
		}
		// this[isIndeterminateValue] = false;
		return false;
	}
	// 列表有选中且非全选，头部全选框待定状态
	for (let i = 0; i < newTableDataList.value.length; i++) {
		if (newTableDataList.value[i][selectionValue] === true) {
			if (selectionValue == "view") {
				isIndeterminate.value = true;
			} else if (selectionValue == "all") {
				isIndeterminate1.value = true;
			}
			// isIndeterminateValue = true;
			return false;
		}
	}
	// 列表有没有选中，头部全选框未选状态
	if (selectionValue == "view") {
		view.value = false;
		isIndeterminate.value = false;
	} else if (selectionValue == "all") {
		all.value = false;
		isIndeterminate1.value = false;
	}
};

const allSelectionFn = (selectionValue: any) => {
	for (let i = 0; i < newTableDataList.value.length; i++) {
		if (newTableDataList.value[i][selectionValue] !== true) {
			return false;
		}
	}
	return true;
};
const filterSelected = (val: any) => {
	console.log(val);
	// if(val){
	//   tableDataList.value =
	// }
	// handleFiltersChange();
	// console.log(table.value?.getSelectionRows());
	// console.log(table.value?.$refs);
	// console.log(IDColumn.value);
	// if (!val) {
	// 	nextTick(() => {
	// 		toggleSelection(table.value?.getSelectionRows());
	// 	});
	// }
};

const getRowKeys = (row: any) => {
	return row.id;
};
const handleSelectionChange = (val: any[]) => {
	props.submitForm.selectedUser = val;
};
const queryFormRaw = {
	table: "Option1",
	table1: "Option2",
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
	getMySaveListApi, //temp test

	beanInfo,
	queryFormRaw
);

const newTableDataList = computed(() => {
	return !checkSelected.value ? tableDataList.value : selectedList.value;
});

const toggleSelection = (selectedArr: any[]) => {
	console.log(table.value?.data);
	if (selectedArr.length) {
		selectedArr.forEach((row: any) => {
			console.log(row);
			nextTick(() => {
				table.value?.toggleRowSelection(row, true);
			});
		});
	}
};
</script>

<style lang="scss" scoped>
.common-layout-system {
	overflow-x: hidden;

	// margin-left: 10px;
	border-radius: 4px;
	height: auto;
	background-color: #fff;
	.table-header-form {
		.all-selected-btn {
			background-color: transparent;
		}
		.all-selected {
			background-color: #ff8259;
			color: #fff;
		}
	}
	.operat-buttons {
		justify-content: space-between;
		margin-top: 0;
		.el-icon {
			margin-left: 8px;
		}
	}
	.table-wrapper {
		display: flex;
		flex-direction: column;

		// overflow-y: auto;
		flex: 1;
		border-top: 1px solid #ebeef5;
		height: 0;
		.common-table.el-table {
			:deep(tbody) {
				tr {
					td.table-cell {
						&:last-of-type {
							.cell {
								justify-content: center;
							}
						}
					}
				}
			}
			:deep(thead) {
				tr {
					th {
						&.selection-header {
							.cell {
								.el-checkbox__inner {
									position: relative;

									// margin-left: -30px;
								}
								&::before {
									position: absolute;
									right: 11px;
									content: "添加";
								}
							}
						}
					}
				}
			}
		}
	}
	.pagination-block {
		flex-direction: row;
		justify-content: space-between;
	}
}
</style>
