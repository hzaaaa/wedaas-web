<template>
	<div class="left-tree-right-table-layout">
		<div class="aside-left" :class="asideClass">
			<div class="action-btn-wrap">
				<el-icon class="icon" v-if="asideClass === 'wider-at-hook'" @click="foldClick"><Fold /></el-icon>
				<el-icon class="icon" v-if="asideClass === 'narrower-at-hook'" @click="expandClick"><Expand /></el-icon>
			</div>
			<!-- v-show="asideClass === 'wider-at-hook'" -->
			<!-- :style="{ opacity: asideClass === 'wider-at-hook' ? 1 : 0 }" -->
			<Transition>
				<div class="tree-wrap" v-show="asideClass === 'wider-at-hook'">
					<!-- <div class="market-tabs">
						<div class="market-tabs-item pointer market-tabs-active">数据市场</div>
						<div class="market-tabs-item pointer">我的空间</div>
					</div> -->
					<el-select class="mt16" v-model="dbRawInfo.dsName" @change="dsNameChange">
						<el-option v-for="item in dsOptions" :key="item.dsName" :label="item.dsName" :value="item.dsName" />
					</el-select>

					<el-input class="mt16" placeholder="请输入关键字" v-model="filterText" :suffix-icon="Search" />
					<div class="view-all">
						<span>表({{ treeData.length }})</span>
						<el-icon><RefreshRight /></el-icon>
					</div>
					<el-tree
						ref="treeRef"
						class="tree-class thin-scrollbar"
						:data="treeData"
						:props="defaultProps"
						@node-click="handleNodeClick"
						:filter-node-method="filterNode"
					/>
				</div>
			</Transition>
		</div>
		<div class="center-block">
			<div class="left-btns">
				<el-button @click="executeClick" :icon="CaretRight" circle />
				<el-button @click="saveQueryStrClick" :icon="Folder" circle />
				<el-button @click="formatClick" :icon="Document" circle />
			</div>
			<div class="right-block">
				<div class="exec-time">执行时间 : 0s</div>
				<!-- <div class="data-base">
					<span class="key">Database</span>
					<el-select></el-select>
				</div> -->
				<div class="top-info">
					<span class="key">Database</span>
					<el-select style="width: auto" value-key="datasourceId" v-model="dbRawInfo.dbObj" @change="dbChange" clearable>
						<el-option v-for="item in dataBaseOptions" :key="item.datasourceId" :label="item.database" :value="item" />
					</el-select>
				</div>
				<div class="sql-input">
					<codemirror
						ref="codeEditor"
						v-model="stringInput"
						placeholder="请输入..."
						:style="{ width: '100%' }"
						:autofocus="true"
						:indent-with-tab="true"
						:tab-size="2"
						:smartIndent="true"
						:extensions="extensionsOpt"
					/>
				</div>
				<div class="sql-result">
					<div class="abs-btn-wrap">
						<el-dropdown>
							<el-icon><Download /></el-icon>

							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item> 将结果数据导出为CSV </el-dropdown-item>
									<el-dropdown-item> 将结果数据导出为Excel </el-dropdown-item>
									<el-dropdown-item @click="onlineExportCSVClick"> 在线导出CSV </el-dropdown-item>
									<el-dropdown-item> 在线导出Excel </el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
					<div class="res-types-title">
						<div class="res-title" @click="activeTab = 'col1Show'" :class="activeTab === 'col1Show' ? 'res-title-active' : ''">
							<span> 结果(0) </span>
							<el-icon @click="fullScreenShow = true"><Rank /></el-icon>
						</div>
						<div class="res-title" @click="activeTab = 'col2Show'" :class="activeTab === 'col2Show' ? 'res-title-active' : ''">
							<span>历史查询</span>
							<el-icon :class="col2ShowInput && activeTab === 'col2Show' ? 'show' : ''" @click="col2ShowInput = !col2ShowInput"
								><Search
							/></el-icon>
							<input v-model="queryForm2.term" @input="searchByQueryForm2" v-show="activeTab === 'col2Show' && col2ShowInput" />
						</div>
						<div class="res-title" @click="activeTab = 'col3Show'" :class="activeTab === 'col3Show' ? 'res-title-active' : ''">
							<span>保存的查询</span>
							<el-icon :class="activeTab === 'col3Show' && col3ShowInput ? 'show' : ''" @click="col3ShowInput = !col3ShowInput"
								><Search
							/></el-icon>
							<!-- <input v-show="activeTab === 'col3Show' && col3ShowInput" /> -->
							<input v-model="queryForm3.term" @input="searchByQueryForm3" v-show="activeTab === 'col3Show' && col3ShowInput" />
						</div>
						<div class="res-title" @click="activeTab = 'col4Show'" :class="activeTab === 'col4Show' ? 'res-title-active' : ''">
							<span>历史导出</span><el-icon><Refresh /></el-icon>
						</div>
					</div>
					<div class="table-wrap" v-show="activeTab === 'col1Show'">
						<el-table
							class="common-table"
							v-loading="tableLoading1"
							:data="tableDataList1"
							border
							style="flex: 1 !important; height: auto"
							ref="multipleTableRef"
							:default-sort="{ prop: 'update_time', order: 'descending' }"
						>
							<el-table-column v-for="key in ddl" :label="key" :prop="key" show-overflow-tooltip> </el-table-column>
						</el-table>
						<div class="pagination-block" style="display: flex; justify-content: flex-end; margin-top: 16px">
							<el-pagination
								:page-sizes="pageParams1.pageSizesList"
								background
								layout="total,sizes,prev, pager, next,jumper"
								@size-change="handleSizeChange1"
								@current-change="handleCurrentPageChange1"
								:current-page="pageParams1.pageNum"
								:page-size="pageParams1.pageSize"
								:total="pageParams1.total"
							/>
						</div>
					</div>
					<div class="table-wrap" v-show="activeTab === 'col2Show'">
						<el-table
							class="common-table"
							v-loading="tableLoading2"
							:data="tableDataList2"
							border
							style="flex: 1 !important; height: auto"
							ref="multipleTableRef"
							:default-sort="{ prop: 'update_time', order: 'descending' }"
						>
							<el-table-column label="create_timeSub" prop="create_timeSub" show-overflow-tooltip> </el-table-column>
							<el-table-column label="execute_state" prop="execute_state" show-overflow-tooltip> </el-table-column>
							<el-table-column label="excute_sql" prop="excute_sql" show-overflow-tooltip> </el-table-column>
							<el-table-column label="execute_time" prop="execute_time" show-overflow-tooltip> </el-table-column>
						</el-table>
						<div class="pagination-block" style="display: flex; justify-content: flex-end; margin-top: 16px">
							<el-pagination
								:page-sizes="pageParams2.pageSizesList"
								background
								layout="total,sizes,prev, pager, next,jumper"
								@size-change="handleSizeChange2"
								@current-change="handleCurrentPageChange2"
								:current-page="pageParams2.pageNum"
								:page-size="pageParams2.pageSize"
								:total="pageParams2.total"
							/>
						</div>
					</div>
					<div class="table-wrap" v-show="activeTab === 'col3Show'">
						<el-table
							class="common-table"
							v-loading="tableLoading3"
							:data="tableDataList3"
							border
							style="flex: 1 !important; height: auto"
							ref="multipleTableRef"
							:default-sort="{ prop: 'update_time', order: 'descending' }"
						>
							<el-table-column label="filename" prop="filename" show-overflow-tooltip> </el-table-column>
							<el-table-column label="querystring" prop="querystring" show-overflow-tooltip> </el-table-column>
							<el-table-column label="dsName" prop="dsName" show-overflow-tooltip> </el-table-column>
							<el-table-column label="dbName" prop="dbName" show-overflow-tooltip> </el-table-column>
						</el-table>
						<div class="pagination-block" style="display: flex; justify-content: flex-end; margin-top: 16px">
							<el-pagination
								:page-sizes="pageParams3.pageSizesList"
								background
								layout="total,sizes,prev, pager, next,jumper"
								@size-change="handleSizeChange3"
								@current-change="handleCurrentPageChange3"
								:current-page="pageParams3.pageNum"
								:page-size="pageParams3.pageSize"
								:total="pageParams3.total"
							/>
						</div>
					</div>
					<div class="table-wrap" v-show="activeTab === 'col4Show'">
						<el-table
							class="common-table"
							v-loading="tableLoading4"
							:data="tableDataList4"
							border
							style="flex: 1 !important; height: auto"
							ref="multipleTableRef"
							:default-sort="{ prop: 'update_time', order: 'descending' }"
						>
							<el-table-column label="excute_status" prop="excute_status" show-overflow-tooltip> </el-table-column>
							<el-table-column label="start_time" prop="start_time" show-overflow-tooltip> </el-table-column>
							<el-table-column label="sqlexcute_time" prop="sqlexcute_time" show-overflow-tooltip> </el-table-column>
							<el-table-column label="response_time" prop="response_time" show-overflow-tooltip> </el-table-column>
							<el-table-column label="row_num" prop="row_num" show-overflow-tooltip> </el-table-column>
							<el-table-column label="sql_string" prop="sql_string" show-overflow-tooltip> </el-table-column>
						</el-table>
						<div class="pagination-block" style="display: flex; justify-content: flex-end; margin-top: 16px">
							<!-- <el-pagination
								:page-sizes="pageParams3.pageSizesList"
								background
								layout="total,sizes,prev, pager, next,jumper"
								@size-change="handleSizeChange3"
								@current-change="handleCurrentPageChange3"
								:current-page="pageParams3.pageNum"
								:page-size="pageParams3.pageSize"
								:total="pageParams3.total"
							/> -->
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="aside-right" :class="asideClassRight">
			<div class="action-btn-wrap">
				<el-icon class="icon" v-if="asideClassRight === 'wider-at-hook'" @click="foldClickRight"><Fold /></el-icon>
				<el-icon class="icon" v-if="asideClassRight === 'narrower-at-hook'" @click="expandClickRight"><Expand /></el-icon>
			</div>
			<Transition>
				<div class="content-wrap" v-show="asideClassRight === 'wider-at-hook'">
					<div class="title">{{ (colInfoList[0] && colInfoList[0].description) || "字段列表" }}</div>
					<div class="details">
						<div class="mt10" v-for="item in colInfoList">
							<div class="row1">
								<tooltipWrap :content="item.colName" class="row1-left" type="x"></tooltipWrap>
								<tooltipWrap :content="item.colType" class="row1-right" type="x"></tooltipWrap>
							</div>
							<div class="row2" v-if="item.colDesp">{{ item.colDesp }}</div>
						</div>
					</div>
				</div>
			</Transition>
		</div>
		<div class="abs-table" v-show="fullScreenShow">
			<div class="title">
				<span> 结果(0) </span>
				<el-icon @click="fullScreenShow = false"><Rank /></el-icon>
			</div>
			<div class="table-wrap">
				<el-table
					class="common-table"
					v-loading="tableLoading1"
					:data="tableDataList1"
					border
					style="flex: 1 !important; height: auto"
					ref="multipleTableRef"
					:default-sort="{ prop: 'update_time', order: 'descending' }"
				>
					<el-table-column v-for="key in ddl" :label="key" :prop="key" show-overflow-tooltip> </el-table-column>
				</el-table>
				<div class="pagination-block" style="display: flex; justify-content: flex-end; margin-top: 16px">
					<el-pagination
						:page-sizes="pageParams1.pageSizesList"
						background
						layout="total,sizes,prev, pager, next,jumper"
						@size-change="handleSizeChange1"
						@current-change="handleCurrentPageChange1"
						:current-page="pageParams1.pageNum"
						:page-size="pageParams1.pageSize"
						:total="pageParams1.total"
					/>
				</div>
			</div>
		</div>
		<saveQueryStrDialog ref="saveQueryStrDialogRef"></saveQueryStrDialog>
		<exportCSVDialog ref="exportCSVDialogRef"></exportCSVDialog>
	</div>
</template>

<script setup lang="ts">
import { Codemirror } from "vue-codemirror";
import { xml as XML } from "@codemirror/lang-xml";
import { html as HTML } from "@codemirror/lang-html";
import { json as JSON } from "@codemirror/lang-json";

import useListPageHook1 from "./listPage";
import useListPageHook2 from "@/hooks/listPage";
import useFoldOrExpandHook from "@/hooks/foldOrExpandHook";
import { Search, CaretRight, Folder, Document } from "@element-plus/icons-vue";
import { connectDsNameQueryApi, getDBSelectorApi } from "@/api/modules/sqlQuery/index";
import { discardSqlApi, getRealtimetablesApi, getColsInfoRealtimeApi, sqlQueryApi } from "@/api/modules/sqlQuery/index";
import { historyQueryApi, saveSqlQueryApi, historyExportApi, saveQueryStrApi } from "@/api/modules/sqlQuery/index";
import router from "@/routers";
import useTreeFilterHook from "@/views/dataCatalogMenu/dataCatalog/hooks/treeFilterHook";
import saveQueryStrDialog from "./components/saveQueryStrDialog.vue";
import exportCSVDialog from "./components/exportCSVDialog.vue";
let stringInput = ref("");
const extensionsOpt = <any>ref([JSON()]);
interface Tree {
	label: string;
	children?: Tree[];
}

const defaultProps = {
	children: "childTuple",
	label: "b",
};
const dbRawInfo = <any>ref({
	dsName: "",
	dbObj: null,
});
const colInfoList = <any>ref([]);
const fullScreenShow = ref(false);
const activeTab = ref("col1Show");

const col2ShowInput = ref(false);
const col3ShowInput = ref(false);

const show_mode = ref("list");

const treeData = ref([]);

const handleNodeClick = (data: any) => {
	// console.log(data);
	tableChange(data);
};

let { asideClass, foldClick, expandClick } = useFoldOrExpandHook();
let { asideClass: asideClassRight, foldClick: foldClickRight, expandClick: expandClickRight } = useFoldOrExpandHook();

//#region 表格 查 相关

const beanInfo = {};
const queryFormRaw = {};
let {
	tableLoading: tableLoading1,

	pageParams: pageParams1,
	tableDataList: tableDataList1,
	ddl,
	handleCurrentPageChange: handleCurrentPageChange1,
	handleSizeChange: handleSizeChange1,

	// refreshData, //刷新按钮

	searchByQueryForm: searchByQueryForm1,

	queryForm: queryForm1,
} = useListPageHook1(
	sqlQueryApi,

	beanInfo,
	queryFormRaw
);
let {
	tableLoading: tableLoading2,

	pageParams: pageParams2,
	tableDataList: tableDataList2,

	handleCurrentPageChange: handleCurrentPageChange2,
	handleSizeChange: handleSizeChange2,

	// refreshData, //刷新按钮

	searchByQueryForm: searchByQueryForm2,

	queryForm: queryForm2,
} = useListPageHook2(
	historyQueryApi,

	beanInfo,
	{
		userId: "9",
		term: "",
	}
);
let {
	tableLoading: tableLoading3,

	pageParams: pageParams3,
	tableDataList: tableDataList3,

	handleCurrentPageChange: handleCurrentPageChange3,
	handleSizeChange: handleSizeChange3,

	// refreshData, //刷新按钮

	searchByQueryForm: searchByQueryForm3,

	queryForm: queryForm3,
} = useListPageHook2(
	saveSqlQueryApi,

	beanInfo,
	{
		userId: "9",
		term: "",
	}
);
const tableLoading4 = <any>ref(false);
const tableDataList4 = <any>ref([]);
const queryHistoryExport = () => {
	historyExportApi({}).then((res: any) => {
		// console.log(historyExportApi)
		tableDataList4.value = res.data;
	});
};
queryHistoryExport();
let treeRef = <any>ref(null);
let { filterText, filterNode } = useTreeFilterHook(defaultProps.label, treeRef);
const dsOptions = ref<any>([]);
const dataBaseOptions = ref<any>([]);
connectDsNameQueryApi({}).then((res: any) => {
	dsOptions.value = res.data;
	dbRawInfo.value.dsName = res.data[0].dsName;
	dsNameChange(dbRawInfo.value.dsName);
});
const dsNameChange = (value: any) => {
	dbRawInfo.value.dbObj = null;
	dataBaseOptions.value = [];

	if (value) {
		let obj = dsOptions.value.find((item: any) => {
			return item.dsName === value;
		});
		getDataBaseOptionsMethod(obj);
	}
};
const getDataBaseOptionsMethod = (obj: any) => {
	let api = <any>getDBSelectorApi;

	api({ ...obj }).then((res: any) => {
		dataBaseOptions.value = res.data || [];
		dbRawInfo.value.dbObj = res.data[0];
		dbChange(dbRawInfo.value.dbObj);
	});
};
let linkType = <any>null;
const dbChange = async (value: any) => {
	linkType = linkType || value.type;

	discardSqlApi({
		uuid: "9" + new Date().getTime(),
		linkType,
	}).then((res: any) => {});
	let params = {
		dbID: value.datasourceId,
		type: value.type,
	};
	let RealtimetablesRes = await getRealtimetablesApi(params);
	treeData.value = RealtimetablesRes.data;

	tableChange(RealtimetablesRes.data[0]);
};
const tableChange = (data: any) => {
	let value = dbRawInfo.value.dbObj;
	getColsInfoRealtimeApi({
		dbID: value.datasourceId,
		type: value.type,
		tableId: data.a,
		tableName: data.b,
	}).then((res: any) => {
		console.log("getColsInfoRealtimeApi", res);
		colInfoList.value = res.data;
	});
};
const executeClick = () => {
	let dbObj = dbRawInfo.value.dbObj;
	console.log("dbObj", dbObj);
	let params = {
		conn_id: dbObj.datasourceId,
		type: dbObj.type,
		rawSQL: stringInput.value,
		query: stringInput.value,
		uuid: "9" + new Date().getTime(),
	};
	queryForm1.value = { ...params };
	searchByQueryForm1();
	// sqlQueryApi({}).then((res:any)=>{

	// })
};

const saveQueryStrDialogRef = <any>ref(null);
const exportCSVDialogRef = <any>ref(null);
const saveQueryStrClick = () => {
	saveQueryStrDialogRef.value.acceptParams(null);
};
const onlineExportCSVClick = () => {
	exportCSVDialogRef.value.acceptParams(null);
};
const formatClick = () => {};
//#endregion
</script>

<style lang="scss" scoped>
* {
	box-sizing: border-box;
}
:deep(.el-tree-node.is-current > .el-tree-node__content) {
	background-color: var(--el-color-primary-light-9) !important;
	border-radius: 4px;
	.custom-node-name {
		color: var(--el-color-primary) !important;
	}
	.custom-node-num {
		color: var(--el-color-primary) !important;
	}
}
:deep(.el-tree-node__content) {
	height: 30px;
}
.left-tree-right-table-layout {
	flex: 1;
	height: 0;
	display: flex;
	width: 100%;
	position: relative;
	.narrower-at-hook {
		width: 24px !important;

		padding: 10px 2px !important;
		padding-right: 4px !important;
		.action-btn-wrap {
		}
	}

	.aside-left {
		transition: all 0.5s;
		width: 300px;
		height: 100%;
		margin-right: 16px;
		border-radius: 10px;
		background: #fff;
		padding: 16px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		.tree-wrap {
			flex: 1;
			height: 0;
			display: flex;
			flex-direction: column;
		}
		.action-btn-wrap {
			display: flex;

			justify-content: flex-end;
		}
		.market-tabs {
			position: relative;
			display: flex;
			justify-content: space-between;
			padding: 8px 0;
			.market-tabs-item {
				flex: 1;
				text-align: center;
				font-size: 13px;
				line-height: 16px;
				color: #27272e;
				opacity: 0.7;
				font-weight: 400;
				&:nth-child(1) {
					border-right: 1px solid #e8e8e8;
				}
			}
			.market-tabs-active {
				font-weight: 500;
				font-size: 13px;
				line-height: 16px;
				opacity: 1;
				color: var(--el-color-primary);
			}
		}
		.view-all {
			font-size: 13px;
			line-height: 1;
			color: #27272e;
			font-weight: 500;
			padding: 10px 8px;
			background: #f8f8f8;
			border-radius: 4px;
			margin: 8px 0;
			margin-top: 16px;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.tree-class {
			flex: 1;
			height: 0;
			overflow: auto;
		}
	}
	.center-block {
		flex: 1;
		height: 100%;
		border-radius: 10px;
		background: #fff;
		display: flex;

		background: #fff;
		border-radius: 4px;
		margin-right: 16px;
		padding: 32px 24px 16px 0;
		box-sizing: border-box;
		// flex-direction: column;
		.left-btns {
			padding-top: 50px;
			width: 48px;
			text-align: center;
			display: flex;
			flex-direction: column;
			position: relative;
			align-items: center;
			background: #fff;
			border-radius: 10px;
			:deep(.el-button) {
				border: none;
				& + .el-button {
					margin-left: 0 !important;
				}
			}
		}
		.right-block {
			flex: 1;
			width: 0;
			position: relative;
			display: flex;
			flex-direction: column;

			.exec-time {
				position: absolute;
				line-height: 32px;
				right: 0;
				color: var(--coloroptext);
				font-size: 13px;
				// right: 260px;
			}
			.data-base {
				width: 200px;
				position: absolute;
				right: 0;
				display: flex;
				.key {
					color: var(--coloroptext);
					margin-right: 10px;
					line-height: 30px;
					font-size: 13px;
				}
			}
			.top-info {
				height: 32px;
				margin-bottom: 16px;
				background: #fff;
				border-radius: 4px;
				display: flex;
				.key {
					color: var(--coloroptext);
					margin-right: 10px;
					line-height: 30px;
					font-size: 13px;
				}
			}
			.sql-input {
				display: flex;
				height: 320px;
				overflow: hidden;
				position: relative;
				border-radius: 2px;
				border: 1px solid #e6e6e6;
			}
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
	.aside-right {
		transition: all 0.5s;
		width: 240px;
		height: 100%;

		// margin-left: 16px;
		border-radius: 10px;
		background: #fff;
		padding: 16px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		.content-wrap {
			flex: 1;
			height: 0;
			display: flex;
			flex-direction: column;
			.title {
				font-weight: 500;
				font-size: 13px;
				line-height: 13px;
				padding-left: 6px;
				border-left: 2px solid var(--el-color-primary);
				margin-left: 12px;
			}
			.details {
				height: 0;
				flex: 1;
				overflow: hidden auto;
				margin-top: 8px;
				border-top: 1px solid var(--bc);
				margin-left: 12px;
				.row1 {
					display: flex;
					justify-content: space-between;
					align-items: center;
					// min-width: 180px;
					font-size: 12px;
					line-height: 25px;
					display: flex;
					color: #777;
					.row1-left {
						max-width: 75%;
						flex: 1;
					}
					.row1-right {
						margin-left: 10px;
						// max-width: 30%;
						min-width: 20%;
						text-align: right;
					}
				}
				.row2 {
					font-weight: 400;
					font-size: 10px;
					line-height: 16px;
					color: #27272e;
					opacity: 0.4;
					margin-top: 4px;
				}
			}
		}
		.action-btn-wrap {
			display: flex;

			justify-content: flex-end;
		}
	}

	.abs-table {
		position: absolute;
		top: 0;
		left: 0;

		width: 100%;
		height: 100%;

		z-index: 999;
		width: 100%;
		height: 100%;
		border-radius: 6px;
		background: #fff;
		padding: 24px;
		display: flex;
		flex-direction: column;
		.title {
			padding-bottom: 16px;
			border-bottom: 1px solid var(--bc);
			display: flex;
			justify-content: space-between;
			align-items: center;
			span {
				font-weight: 500;
				font-size: 14px;
				line-height: 16px;
				color: var(--colormaintext);
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
</style>
