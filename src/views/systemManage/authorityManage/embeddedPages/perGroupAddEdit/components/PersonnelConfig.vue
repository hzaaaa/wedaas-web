<template>
	<div class="common-layout-system">
		<el-form :model="queryForm" class="table-header-form">
			<el-form-item label="用户搜索">
				<el-input v-model="queryForm.name" placeholder="请输入" suffix-icon="search"></el-input>
			</el-form-item>
		</el-form>
		<div class="operat-buttons">
			<span>新增用户</span>
			<el-checkbox
				v-model="checkSelected"
				:label="`查看已勾选（${props.submitForm.selectedUser ? props.submitForm.selectedUser.length : 0}）`"
				@change="filterSelected"
			></el-checkbox>
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
				@selection-change="handleSelectionChange"
				:row-key="getRowKeys"
			>
				<el-table-column label="ID" prop="id"> </el-table-column>
				<el-table-column label="用户名" prop="tableName"> </el-table-column>
				<el-table-column label="邮箱" prop="dataCatalog"> </el-table-column>
				<el-table-column
					type="selection"
					width="100px"
					label-class-name="selection-header"
					header-align="center"
					:reserve-selection="true"
				>
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
import { getAdvancedSearchListApi } from "@/api/modules/mock/mock";
import { useRoute, useRouter } from "vue-router";
import type { ElTable, ElTableColumn } from "element-plus";

const router = useRouter();
const checkSelected = ref(false);

let props = defineProps(["submitForm"]);
const table = ref<InstanceType<typeof ElTable> | null>(null);
const filterSelected = (val: any) => {
	console.log(val);
	// if(val){
	//   tableDataList.value =
	// }
	// handleFiltersChange();
	console.log(table.value?.getSelectionRows());
	// console.log(table.value?.$refs);
	// console.log(IDColumn.value);
	if (!val) {
		nextTick(() => {
			toggleSelection(table.value?.getSelectionRows());
		});
	}
};

const getRowKeys = (row: any) => {
	return row.id;
};
const handleSelectionChange = (val: any[]) => {
	props.submitForm.selectedUser = val;
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
	getAdvancedSearchListApi, //temp test

	beanInfo,
	queryFormRaw
);

const newTableDataList = computed(() => {
	return !checkSelected.value ? tableDataList.value : table.value?.getSelectionRows();
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
