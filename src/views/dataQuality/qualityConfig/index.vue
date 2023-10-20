<template>
	<div class="qualityConfig">
		<div class="quality-header">数据配置</div>
		<div class="quality-table">
			<el-table
				class="common-table"
				v-loading="tableLoading"
				:data="tableDataList"
				border
				style="flex: 1 !important; height: auto"
				ref="multipleTableRef"
				:default-sort="{ prop: 'update_time', order: 'descending' }"
			>
				<el-table-column label="数据源" prop="" show-overflow-tooltip>
					<template #default="scope"> {{ scope.row.data_source_id.split(".")[0] }}</template>
				</el-table-column>

				<el-table-column label="数据库" prop=" " show-overflow-tooltip-none>
					<template #default="scope"> {{ scope.row.data_source_id.split(".")[1] }}</template>
				</el-table-column>

				<el-table-column label="数据库类型" prop="type" show-overflow-tooltip-none> </el-table-column>
				<el-table-column label="完成情况" prop=" " show-overflow-tooltip-none>
					<template #default="scope"> {{ scope.row.total_run ? `${scope.row.total_run}/${scope.row.total}` : "暂无" }}</template>
				</el-table-column>
				<el-table-column label="创建时间" prop=" " show-overflow-tooltip-none>
					<template #default="scope">
						<el-date-picker
							style="width: 180px"
							v-model="scope.row.run_time"
							type="datetime"
							placeholder="暂未设置"
							:clearable="false"
						/>
					</template>
				</el-table-column>
				<el-table-column label="运行时长" prop=" " show-overflow-tooltip-none>
					<template #default="scope">
						<el-select v-model="scope.row.run_hours" placeholder="请选择" style="width: 180px">
							<el-option v-for="item in 24" :key="item" :label="item" :value="item" />
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="运行项" prop=" " show-overflow-tooltip-none>
					<template #default="scope">
						<el-select v-model="scope.row.run_item" placeholder="请选择" style="width: 180px">
							<el-option
								v-for="item in [
									{
										value: 'all',
										label: 'all',
									},
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="80" header-align="left" align="left" fixed="right">
					<template #default="scope">
						<div class="flex-left">
							<span class="two-word-button">
								<el-button type="primary" link>删除</el-button>
								<el-button type="info" class="button-hold-position" disabled link>删除</el-button>
							</span>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="quality-page">
			<el-pagination
				:page-sizes="pageParams.pageSizesList"
				background
				layout="total,sizes,prev, pager, next,jumper"
				@size-change="handleSizeChange"
				@current-change="handleCurrentPageChange"
				:current-page="pageParams.pageNum"
				:page-size="pageParams.pageSize"
				:total="pageParams.total"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {} from "vue";
import useListPageHook from "@/hooks/listPage";
import listDataJson from "./listData.json";
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
	list = listDataJson.data.list;
	list = [...list, ...list];
	// list = [...list, ...list];
	// list = [...list, ...list];
	// list = [...list, ...list];
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
	queryFormRaw
);
</script>

<style lang="scss" scoped>
.qualityConfig {
	height: 0;
	flex: 1;
	display: flex;
	flex-direction: column;

	padding: 24px;
	background: #fff;
	border-radius: 4px;
	.quality-header {
		font-weight: 500;
		font-size: 14px;
		line-height: 16px;
		color: var(--colormaintext);
		padding-bottom: 16px;
		border-bottom: 1px solid var(--bc);
	}
	.quality-table {
		width: 100%;
		margin-top: 16px;
		flex: 1;
		height: 0;
		display: flex;
		flex-direction: column;
	}
	.quality-page {
		padding-top: 16px;
		text-align: right;
		display: flex;
		justify-content: flex-end;
	}
}
</style>
