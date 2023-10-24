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
			<el-table-column label="活动id" prop="id" show-overflow-tooltip> </el-table-column>
			<el-table-column label="活动名称" prop="activity_name" show-overflow-tooltip> </el-table-column>
			<el-table-column label="活动类型（1：满减，2：折扣）" prop="activity_type" show-overflow-tooltip> </el-table-column>
			<el-table-column label="活动描述" prop="activity_desc" show-overflow-tooltip> </el-table-column>
			<el-table-column label="开始时间" prop="start_time" show-overflow-tooltip> </el-table-column>
			<el-table-column label="结束时间" prop="end_time" show-overflow-tooltip> </el-table-column>
			<el-table-column label="创建时间" prop="create_time" show-overflow-tooltip> </el-table-column>
		</el-table>
	</div>
</template>

<script setup lang="ts">
import {} from "vue";
import listDataJson from "./sample.json";
import useListPageHook from "@/hooks/listPage";

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
	list = listDataJson.data.sample;
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
} = useListPageHook(
	// getCompanyListApi,
	getTableListApi, //temp test

	beanInfo,
	queryFormRaw,
	null,
	null
);
</script>

<style lang="scss" scoped></style>
