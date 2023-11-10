<template>
	<div class="paramsCode">
		<div class="left-block">
			<div class="block-title">配置表</div>
			<div class="" style="height: 40px">
				<el-select style="height: 30px; width: 200px" v-model="dbRawInfo.dsName" @change="dsNameChange">
					<el-option v-for="item in dsOptions" :key="item.dsName" :label="item.dsName" :value="item.dsName"
				/></el-select>
				<div style="display: inline-block; width: 4%"></div>
				<el-select
					style="display: inline-block; width: calc(46% - 100px)"
					value-key="datasourceId"
					v-model="dbRawInfo.dbObj"
					@change="dbChange"
				>
					<el-option v-for="item in dataBaseOptions" :key="item.datasourceId" :label="item.database" :value="item"
				/></el-select>
				<div style="display: inline-block; width: 4%"></div>
				<el-select style="display: inline-block; width: calc(46% - 100px)"></el-select>
			</div>

			<div class="btn-and-title">
				<div class="title">参数字段</div>
				<div class="btn-right" @click="openApiListDialogClick">已生成API 3</div>
			</div>

			<el-table
				ref="multipleTableRef"
				:data="tableData"
				style="width: 100%; flex: 1 !important; height: auto"
				class="common-table"
				border
			>
				<el-table-column type="selection" width="55" />
				<el-table-column label="字段名" width="120">
					<template #default="scope">{{ scope.row.date }}</template>
				</el-table-column>
				<el-table-column property="name" label="描述" width="120" />
				<el-table-column property="address" label="类型" show-overflow-tooltip />
			</el-table>
		</div>
		<div class="center-btns">
			<div class="btn btn1">
				<el-icon><ArrowRight /></el-icon>
			</div>
			<div class="btn btn2">
				<el-icon><ArrowLeft /></el-icon>
			</div>
		</div>
		<div class="right-block">
			<div class="sql-result">
				<div class="res-types-title">
					<div class="res-title" @click="activeTab = 'col1Show'" :class="activeTab === 'col1Show' ? 'res-title-active' : ''">
						<span> 请求参数</span>
					</div>
					<div class="res-title" @click="activeTab = 'col2Show'" :class="activeTab === 'col2Show' ? 'res-title-active' : ''">
						<span>返回参数</span>
					</div>
					<div class="res-title" @click="activeTab = 'col3Show'" :class="activeTab === 'col3Show' ? 'res-title-active' : ''">
						<span> 结果(0)</span>
					</div>
				</div>
				<div class="table-wrap">
					<el-table
						class="common-table"
						v-loading="tableLoading"
						:data="tableDataList"
						border
						style="flex: 1 !important; height: auto"
						:default-sort="{ prop: 'update_time', order: 'descending' }"
					>
						<el-table-column type="selection" width="55" />
						<el-table-column label="字段名" prop="name" min-width="180" show-overflow-tooltip>
							<template #default="scope">
								<span :key="scope.row.id" :underline="false" class="blue-link">{{ scope.row.name }}</span>
							</template>
						</el-table-column>

						<el-table-column label="描述" prop="description" min-width="180" show-overflow-tooltip></el-table-column>

						<el-table-column prop="createTime" sortable="custom" label="类型" width="180">
							<template #default="scope">
								{{ scope.row.createTime }}
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="" style="height: 60px"></div>
			</div>
		</div>

		<apiListDialog ref="apiListDialogRef" @refreshData=""></apiListDialog>
	</div>
</template>

<script setup lang="ts">
import {} from "vue";
import useParamsCodeHookfrom from "@/views/SQLQuery/hooks/paramsCodeHook.ts";
import useListPageHook from "@/hooks/listPage";
import listDataJson from "./listData.json";
import apiListDialog from "./apiListDialog.vue";

let {
	dbRawInfo,
	dsOptions,
	dataBaseOptions,
	treeData,
	defaultProps,
	colInfoList,

	dsNameChange,
	getDataBaseOptionsMethod,
	dbChange,
	tableChange,
	handleNodeClick,
} = useParamsCodeHookfrom();

const apiListDialogRef = <any>ref(null);
const openApiListDialogClick = () => {
	apiListDialogRef.value.acceptParams({
		row: {},
	});
};
let tableData = [
	{
		date: "2016-05-03",
		name: "Tom",
		address: "No. 189, Grove St, Los Angeles",
	},
	{
		date: "2016-05-02",
		name: "Tom",
		address: "No. 189, Grove St, Los Angeles",
	},
	{
		date: "2016-05-04",
		name: "Tom",
		address: "No. 189, Grove St, Los Angeles",
	},
	{
		date: "2016-05-01",
		name: "Tom",
		address: "No. 189, Grove St, Los Angeles",
	},
	{
		date: "2016-05-08",
		name: "Tom",
		address: "No. 189, Grove St, Los Angeles",
	},
	{
		date: "2016-05-06",
		name: "Tom",
		address: "No. 189, Grove St, Los Angeles",
	},
	{
		date: "2016-05-07",
		name: "Tom",
		address: "No. 189, Grove St, Los Angeles",
	},
];
tableData = [...tableData, ...tableData];
tableData = [...tableData, ...tableData];
tableData = [...tableData, ...tableData];
const activeTab = ref("col1Show");
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
	list = listDataJson.data;
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
	queryFormRaw
);
</script>

<style lang="scss" scoped>
.paramsCode {
	flex: 1;
	height: 0;
	display: flex;
	width: 100%;
	position: relative;
	.left-block {
		flex: 1 1 0%;
		display: flex;
		padding-top: 16px;
		flex-direction: column;
		padding-left: 16px;
		.block-title {
			font-weight: 500;
			font-size: 14px;
			line-height: 16px;
			color: #27272e;
			padding-bottom: 8px;
		}
		.btn-and-title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 8px;
			.title {
				font-weight: 500;
				font-size: 14px;
				line-height: 16px;
				color: #27272e;
			}
			.btn-right {
				padding: 4px 8px;
				background: var(--el-color-primary);
				border-radius: 4px;
				color: #fff;
				font-size: 13px;
				line-height: 16px;
				cursor: pointer;
			}
		}
	}
	* {
		box-sizing: border-box;
	}
	.center-btns {
		width: 40px;
		padding: 0 8px;
		position: relative;

		.btn {
			position: absolute;
			background-color: var(--el-color-primary);
			color: #fff;
			width: 24px;
			height: 24px;
			line-height: 24px;
			text-align: center;
			border-radius: 2px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.btn1 {
			top: calc(50% - 52px);
		}
		.btn2 {
			top: calc(50% + 52px);
		}
	}
	.right-block {
		flex: 2;
		overflow: auto;
		margin-right: 16px;
		padding-top: 16px;
		display: flex;
		flex-direction: column;
		.sql-result {
			flex: 1;
			height: 0;
			display: flex;
			flex-direction: column;
			position: relative;
			.abs-btn-wrap {
				padding-top: 50px;
				width: 48px;
				text-align: center;
				display: flex;
				flex-direction: column;
				position: relative;
				align-items: center;
				background: #fff;
				position: absolute;
				top: 0;
				left: -50px;
				width: 50px;
			}
			.res-types-title {
				line-height: 32px;
				height: 32px;
				padding: 0;
				border-bottom: none;
				border-radius: 2px;
				padding-left: 0;
				margin-top: 8px;
				margin-bottom: 6px;
				display: flex;
				.res-title {
					padding-left: 8px;
					min-width: 140px;
					font-size: 14px;
					font-weight: 400;
					color: var(--coloroptext);

					display: flex;
					align-items: center;
					cursor: pointer;
					&:hover {
						:deep(.el-icon) {
							display: inline-flex !important;
						}
					}
					:deep(.el-icon) {
						display: none;
						margin-left: 5px;
					}
					:deep(.el-icon.show) {
						display: inline-flex;
					}
					:deep(input) {
						margin-right: 10px;
						font-size: 14px;
						padding: 4px 8px;
						color: #adadad;
						background: #fcfcfc;
						box-sizing: border-box;
						border-radius: 4px;
						overflow: hidden;
						border: 1px solid var(--el-color-primary);
						outline: none;
						margin-left: 8px;
					}
				}
				.res-title-active {
					font-weight: 600 !important;
					color: var(--el-color-primary) !important;

					border-bottom: none !important;
				}
			}
			.table-wrap {
				flex: 1;
				height: 0;
				display: flex;
				flex-direction: column;
			}
		}
	}
}
</style>
