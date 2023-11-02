<template>
	<div class="top-query-bottom-table">
		<div class="query-block">
			<div class="query-top">设置表到 「{{ childData.rootName }}」</div>
			<div class="query-bottom">
				<div class="input-item">
					<span class="item-label">选择数据源</span>
					<el-select style="width: auto" v-model="queryForm.dsName" @change="dsNameChange">
						<el-option v-for="item in dataSourceOptions" :key="item.dsName" :label="item.dsName" :value="item.dsName" />
					</el-select>
				</div>
				<div class="input-item">
					<el-select style="width: auto" v-model="queryForm.dbName" @change="searchByQueryForm">
						<el-option v-for="item in dataBaseOptions" :key="item.c" :label="item.c" :value="item.c" />
					</el-select>
				</div>
				<div class="input-item ml24">
					<span class="item-label">搜索表</span>
					<el-input style="width: auto" v-model="queryForm.tableName" @input=""></el-input>
				</div>
				<div class="input-item ml24 checkbox">
					<div class="checkbox-item">
						<el-checkbox @change="viewCheckedChange" v-model="viewChecked" :label="`查看已勾选( ${setSize0} )`" />
						<!-- <input type="checkbox" />
						<span class="title">查看已勾选( 0 )</span> -->
					</div>
				</div>
			</div>
		</div>
		<div class="table-block">
			<el-table
				class="common-table"
				v-loading="tableLoading"
				:data="filteredTableDataList"
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

				<el-table-column label="操作" width="80" header-align="left" align="left" fixed="right">
					<template #header>
						<el-checkbox v-model="addCheckedAll0" @change="checkedParamList[0].addCheckedAllChange" label="操作" size="large" />
					</template>

					<template #default="scope">
						<el-checkbox
							:key="scope.row.ti"
							@change="(value:any)=>checkedParamList[0].itemCheckedChange(value,scope.row)"
							v-model="scope.row.checked0"
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
				<el-button v-if="setSize0" style="margin-right: 28px" @click="setTableClick" type="primary">确定</el-button>
			</div>
			<!-- <div class="">
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
			</div> -->
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import useListPageHook from "../../dataCatalog/hooks/listPageForSetChild";

import { getTableByDataSourceIdandLabelIdApi, setTableFromLabelApi } from "@/api/modules/dataCatalog/labelManage";
import { getCatalogListApi, getDSSelectorApi, getDBSelectorApi /* 待修改 */ } from "@/api/modules/dataCatalog/dataCatalog";
const router = useRouter();

let childData = ref<any>({ ...history.state.params });
console.log("childData", childData.value);

const viewChecked = ref(false);
const viewCheckedChange = (value: any) => {
	console.log("viewCheckedChange", value);
};

const beanInfo = {};
const queryFormRaw = {
	dsName: "",
	dbName: "",
	tableName: "",
	labelId: childData.value.rootId,
};
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
	getTableByDataSourceIdandLabelIdApi,

	beanInfo,
	queryFormRaw,
	(obj: any) => {
		let target = { ...obj };

		target.datasourceId = target.dsName + "." + target.dbName;

		target.labelId = childData.value.rootId;

		delete target.dsName;
		return target;
	},
	() => {
		console.log("tableDataList", tableDataList.value);
	},
	[
		{
			key: "ti",
			checkedBy: "checked0",
		},
	]
);
let addCheckedAll0 = checkedParamList[0].addCheckedAll;
let setSize0 = checkedParamList[0].setSize;

const filteredTableDataList = computed(() => {
	if (!viewChecked.value) {
		return tableDataList.value.filter((item: any) => {
			return item.tn.indexOf(queryForm.value.tableName) !== -1;
		});
	} else {
		return tableDataList.value.filter((item: any) => {
			return item.tn.indexOf(queryForm.value.tableName) !== -1 && item.checked0;
		});
	}
});

const dataSourceOptions = ref<any[]>([]);

const getDataSourceOptionMethod = () => {
	let api = <any>getDSSelectorApi;

	getDSSelectorApi({}).then((res: any) => {
		dataSourceOptions.value = res.data || [];
		queryForm.value.dsName = dataSourceOptions.value[0].dsName;
		dsNameChange(queryForm.value.dsName);
	});
};
getDataSourceOptionMethod();
const dsNameChange = (value: any) => {
	queryForm.value.dbName = "";
	dataBaseOptions.value = [];

	if (value) {
		let obj = dataSourceOptions.value.find((item: any) => {
			return item.dsName === value;
		});
		getDataBaseOptionsMethod(obj);
	}
};

const dataBaseOptions = ref<any[]>([]);

const getDataBaseOptionsMethod = (obj: any) => {
	getDBSelectorApi({ ...obj }).then((res: any) => {
		dataBaseOptions.value = res.data || [];
		queryForm.value.dbName = dataBaseOptions.value[0].c;
		searchByQueryForm();
	});
};

const setTableClick = () => {
	let tableIdList = [...checkedParamList[0].checkedAllSet];
	// let tableNameList = [];
	// for (let i = 0; i < tableIdList.length; i++) {
	// 	let checkedItemId = tableIdList[i];
	// 	for (let j = 0; j < tableDataList.value.length; j++) {
	// 		let tableItem = tableDataList.value[j];
	// 		if (checkedItemId === tableItem.ti) {
	// 			tableNameList.push(tableItem.tn);
	// 			break;
	// 		}
	// 	}
	// }
	console.log("tableIdList", tableIdList);
	// console.log("tableNameList", tableNameList);
	setTableFromLabelApi({
		tableIds: tableIdList,
		// tableNames: tableNameList.toString(),
		labelId: childData.value.rootId,
	}).then((res: any) => {
		//添加成功
		ElMessage.success("添加成功！");
		searchByQueryForm();
		checkedParamList[0].resetChecked();
	});
};
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
