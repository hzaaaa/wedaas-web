<template>
	<div class="" style="flex: 1; height: 0; display: flex; flex-direction: column">
		<el-table
			class="common-table"
			v-loading="tableLoading"
			:data="tableDataList"
			border
			style="flex: 1 !important; height: auto"
			ref="multipleTableRef"
			:default-sort="{ prop: 'update_time', order: 'descending' }"
		>
			<el-table-column type="index" width="100" label="序号" />
			<el-table-column label="字段名" prop="col_name" show-overflow-tooltip> </el-table-column>

			<el-table-column prop="col_type" label="类型"> </el-table-column>
			<el-table-column prop="createBy" label="业务规则"> </el-table-column>
			<el-table-column prop="createTime" label="业务定义"> </el-table-column>
			<el-table-column prop="colIsNull" label="是否为空"> </el-table-column>
			<el-table-column prop="status" label="数值范围"> </el-table-column>
			<el-table-column prop="col_desp" label="描述"> </el-table-column>
			<el-table-column prop="colComment" label="备注"> </el-table-column>
			<el-table-column prop="status" label=" 探查 " header-align="left" align="left" fixed="right">
				<template #header>
					<el-checkbox v-model="addCheckedAll0" @change="checkedParamList[0].addCheckedAllChange" label="探查" size="large" />
				</template>

				<template #default="scope">
					<el-checkbox
						:key="pageParams.pageNum + scope.$index"
						@change="(value:any)=>checkedParamList[0].itemCheckedChange(value,scope.row)"
						v-model="scope.row.checked0"
						label="加入探查"
						size="large"
					/>
				</template>
			</el-table-column>
			<el-table-column prop="status" label="操作" header-align="left" align="left" fixed="right">
				<template #default="scope">
					<div class="flex-left">
						<span class="two-word-button">
							<el-button link type="primary" size="small" @click="openAttributeDialogClick">编辑</el-button>
							<el-button type="info" class="button-hold-position" disabled link>编辑</el-button>
						</span>
					</div>

					<!-- <template> -->

					<!-- </template> -->
				</template>
			</el-table-column>
		</el-table>
		<div class="mt32" style="text-align: right">
			<el-button type="primary" @click="console.log(checkedParamList[0].checkedAllSet)">确认探查项</el-button>
		</div>
		<attributeDialog ref="attributeDialogRef" @refreshData=""></attributeDialog>
	</div>
</template>

<script setup lang="ts">
import {} from "vue";
import listDataJson from "./tableInfo.json";
import useListPageHook from "@/hooks/listPage";
import attributeDialog from "./attributeDialog.vue";

const attributeDialogRef = <any>ref(null);
const openAttributeDialogClick = () => {
	attributeDialogRef.value.acceptParams({
		row: {},
	});
};
let createTableByData = (pageSize: number, pageNum: number) => {
	let list: any = [];

	while (pageSize--) {
		list.push({
			dataName: 0,

			receiptSide: "receiptSide",
			description: "description",
			status: "status",
			notes: "notes" + pageNum,
		});
	}
	list = listDataJson.data.colInfo;
	list = [...list, ...list];
	list = [...list, ...list];
	list = [...list, ...list];
	list = [...list, ...list];
	return list;
};
const getTableListApi = (params: any) => {
	console.log({ ...params });
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve({
				data: {
					total: params.pageSize * 2,
					list: createTableByData(params.pageSize, params.pageNum),
				},
			});
		}, 500);
	});
};

const beanInfo = {};
const queryFormRaw = {};
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
	checkedParamList,
} = useListPageHook(
	// getCompanyListApi,
	getTableListApi, //temp test

	beanInfo,
	queryFormRaw,
	null,
	null,
	[
		{
			key: "col_id",
			checkedBy: "checked0",
		},
	]
);
let addCheckedAll0 = checkedParamList[0].addCheckedAll;
</script>

<style lang="scss" scoped></style>
