<template>
	<div class="top-query-bottom-table">
		<div class="query-block">
			<div class="query-top">设置表到 「testc」</div>
			<div class="query-bottom">
				<div class="input-item">
					<span class="item-label">选择数据库</span>
					<el-select></el-select>
				</div>
				<div class="input-item">
					<el-select></el-select>
				</div>
				<div class="input-item ml24">
					<span class="item-label">搜索表</span>
					<el-select></el-select>
				</div>
				<div class="input-item ml24 checkbox">
					<div class="checkbox-item">
						<input type="checkbox" />
						<span class="title">查看已勾选( 0 )</span>
					</div>
				</div>
			</div>
		</div>
		<div class="table-block">
			<el-table
				class="common-table"
				v-loading="tableLoading"
				:data="tableDataList"
				border
				style="flex: 1 !important; height: auto"
				ref="multipleTableRef"
				:default-sort="{ prop: 'update_time', order: 'descending' }"
			>
				<el-table-column label="表名" prop="tn" show-overflow-tooltip> </el-table-column>
				<el-table-column label="表描述" prop="td" show-overflow-tooltip> </el-table-column>
				<el-table-column label="数据源" prop="ds" show-overflow-tooltip>
					<template #default="scope"> {{ scope.row.ds.split(".")[0] }}</template>
				</el-table-column>
				<el-table-column label="数据库" prop="dn" show-overflow-tooltip> </el-table-column>

				<!-- <el-table-column label="数据源" prop="" show-overflow-tooltip>
					<template #default="scope"> {{ scope.row.schema.split(".")[0] }}</template>
				</el-table-column>

				<el-table-column label="数据库" prop=" " show-overflow-tooltip-none>
					<template #default="scope"> {{ scope.row.schema.split(".")[1] }}</template>
				</el-table-column>
				<el-table-column prop="description" label="表描述" width="180"> </el-table-column> -->

				<el-table-column label="操作" width="80" header-align="left" align="left" fixed="right">
					<template #header>
						<el-checkbox v-model="addCheckedAll" @change="addCheckedAllChange" label="操作" size="large" />
					</template>

					<template #default="scope">
						<el-checkbox
							:key="pageParams.pageNum + scope.$index"
							@change="itemCheckedChange"
							v-model="scope.row.checked"
							label="添加"
							size="large"
						/>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="footer">
			<div class="">
				<el-button style="margin-right: 28px" @click="router.go(-1)">返回</el-button>
				<el-button style="margin-right: 28px" type="primary">确定</el-button>
			</div>
			<div class="">
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
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import useListPageHook from "@/hooks/listPage";
import listDataJson from "./listData.json";
const router = useRouter();
const addCheckedAll = ref(false); //切页时记得修改
const addCheckedAllChange = (val: any) => {
	tableDataList.value.forEach((item: any) => {
		item.checked = val;
	});
};
const itemCheckedChange = (val: any) => {
	addCheckedAll.value = tableDataList.value.every((item: any) => {
		return item.checked === true;
	});
};
const multipleSelection = ref<any>([]);
const handleSelectionChange = (val: []) => {
	multipleSelection.value = val;
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
	listDataJson.data.forEach((item: any) => {
		item.checked = undefined;
	});
	list = listDataJson.data;
	// list = [...list, ...list];
	// list = [...list, ...list];
	// list = [...list, ...list];
	// list = [...list, ...list];
	// return [];
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
	() => {
		console.log("tableDataList", tableDataList.value);
	}
);
</script>

<style lang="scss" scoped>
* {
	box-sizing: border-box;
}
.top-query-bottom-table {
	flex: 1;
	height: 0;
	display: flex;
	width: 100%;
	flex-direction: column;
	.query-block {
		padding: 16px 24px;
		background: #fff;
		border-radius: 4px;
		// width: 100%;
		.query-top {
			font-weight: 500;
			font-size: 14px;
			line-height: 16px;
			color: var(--colormaintext);
			padding-bottom: 16px;
			border-bottom: 1px solid var(--bc);
		}
		.query-bottom {
			width: 100%;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding-top: 16px;
			.input-item {
				font-weight: 400;
				font-size: 13px;
				line-height: 16px;
				margin-right: 8px;
				color: var(--colormaintext);
				.item-label {
					font-weight: 400;
					font-size: 13px;
					line-height: 16px;
					margin-right: 8px;
					color: var(--colormaintext);
				}
			}
			.checkbox {
				font-weight: 400;
				font-size: 13px;
				line-height: 16px;
				flex: 1;
				color: var(--coloroptext);
				.checkbox-item {
					margin: 0 auto;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					min-width: 120px;
				}
				.title {
					margin-left: 2px;
				}
			}
		}
	}
	.table-block {
		margin-top: 16px;
		height: 0;
		flex: 1;
		padding: 24px 24px 0;
		background: #fff;
		border-radius: 4px 4px 0 0;
		display: flex;
		flex-direction: column;
	}
	.footer {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		padding: 24px;
	}
}
</style>
