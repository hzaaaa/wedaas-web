<template>
	<div class="left-tree-right-table-layout">
		<div class="aside-left" :class="asideClass">
			<div class="action-btn-wrap">
				<el-icon class="icon" v-if="asideClass === 'wider-at-hook'" @click="foldClick"><Fold /></el-icon>
				<el-icon class="icon" v-if="asideClass === 'narrower-at-hook'" @click="expandClick"><Expand /></el-icon>
			</div>

			<Transition>
				<div class="tree-wrap" v-show="asideClass === 'wider-at-hook'">
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
			</div>
			<div class="right-block">
				<div class="exec-time">执行时间 : 0s</div>

				<div class="top-info">
					<span class="key">Database</span>
					<el-select style="width: auto" value-key="datasourceId" v-model="dbRawInfo.dbObj" @change="dbChange">
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
						<!-- <el-icon><Download /></el-icon> -->
					</div>
					<div class="res-types-title">
						<div class="res-title" @click="activeTab = 'col3Show'" :class="activeTab === 'col3Show' ? 'res-title-active' : ''">
							<span> 请求参数</span>
						</div>
						<div class="res-title" @click="activeTab = 'col2Show'" :class="activeTab === 'col2Show' ? 'res-title-active' : ''">
							<span>返回参数</span>
						</div>
						<div class="res-title" @click="activeTab = 'col1Show'" :class="activeTab === 'col1Show' ? 'res-title-active' : ''">
							<span> 结果(0)</span>
						</div>
					</div>
					<div class="table-wrap" v-show="activeTab === 'col1Show'">
						<el-table
							class="common-table"
							v-loading="tableLoading1"
							:data="tableDataListRaw"
							border
							style="flex: 1 !important; height: auto"
							:default-sort="{ prop: 'update_time', order: 'descending' }"
						>
							<el-table-column v-for="key in ddl" :label="key" :prop="key" show-overflow-tooltip> </el-table-column>
						</el-table>
					</div>
					<div class="table-wrap" v-show="activeTab === 'col2Show'">
						<el-table
							class="common-table"
							:data="returnParamList"
							border
							style="flex: 1 !important; height: auto"
							:default-sort="{ prop: 'update_time', order: 'descending' }"
						>
							<el-table-column label="字段名" prop="fieldName" show-overflow-tooltip>
								<template #default="scope">
									<el-input v-model="scope.row.fieldName" style="width: 100%" />
								</template>
							</el-table-column>
							<el-table-column label="描述" prop="description" show-overflow-tooltip>
								<template #default="scope">
									<el-input v-model="scope.row.description" style="width: 100%" />
								</template>
							</el-table-column>
							<el-table-column label="操作">
								<template #default="scope">
									<el-button size="small" link type="primary" @click="addRowCol2(scope)">增加行</el-button>
									<el-button size="small" link type="primary" @click="deleteRowCol2(scope)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div class="table-wrap" v-show="activeTab === 'col3Show'">
						<el-table
							class="common-table"
							:data="queryParamList"
							border
							style="flex: 1 !important; height: auto"
							:default-sort="{ prop: 'update_time', order: 'descending' }"
						>
							<el-table-column label="字段名" prop="fieldName" show-overflow-tooltip>
								<template #default="scope">
									<el-input v-model="scope.row.fieldName" style="width: 100%" />
								</template>
							</el-table-column>
							<el-table-column label="描述" prop="description" show-overflow-tooltip>
								<template #default="scope">
									<el-input v-model="scope.row.description" style="width: 100%" />
								</template>
							</el-table-column>
							<el-table-column label="类型" prop="columnType" show-overflow-tooltip>
								<template #default="scope">
									<el-select v-model="scope.row.columnType" placeholder="请选择" style="width: 100%">
										<el-option v-for="item in ['raw', 'number', 'string']" :key="item" :label="item" :value="item" />
									</el-select>
								</template>
							</el-table-column>
							<el-table-column label="默认值" prop="defaultValue" show-overflow-tooltip>
								<template #default="scope">
									<el-input v-model="scope.row.defaultValue" style="width: 100%" />
								</template>
							</el-table-column>
							<el-table-column label="必填" prop="required" show-overflow-tooltip>
								<template #default="scope">
									<el-checkbox v-model="scope.row.required" label="" />
								</template>
							</el-table-column>
							<el-table-column label="操作">
								<template #default="scope">
									<el-button size="small" link type="primary" @click="addRowCol3(scope)">增加行</el-button>
									<el-button size="small" link type="primary" @click="deleteRowCol3(scope)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div class="mt20">
						<el-button type="primary" @click="abstractParamsClick">辅助抽取参数</el-button>
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
		<parseParamListDialog ref="parseParamListDialogRef" @exec="buildSql"></parseParamListDialog>
	</div>
</template>

<script setup lang="ts">
import useListPageHook1 from "@/views/SQLQuery/listPage";
import useListPageHook2 from "@/hooks/listPage";

import { Codemirror } from "vue-codemirror";
import { xml as XML } from "@codemirror/lang-xml";
import { html as HTML } from "@codemirror/lang-html";
import { json as JSON } from "@codemirror/lang-json";

import useFoldOrExpandHook from "@/hooks/foldOrExpandHook";
import { Search, CaretRight, Folder, Document } from "@element-plus/icons-vue";
import router from "@/routers";
import useParamsCodeHookfrom from "@/views/SQLQuery/hooks/paramsCodeHook.ts";
import useTreeFilterHook from "@/views/dataCatalogMenu/dataCatalog/hooks/treeFilterHook";
import parseParamListDialog from "../parseParamListDialog.vue";
import { buildSQLApi, discardSqlApi, testExecSqlApi, sqlQueryApi } from "@/api/modules/sqlQuery/index";
let parseParamListDialogRef = <any>ref(null);

let treeRef = <any>ref(null);
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
let { filterText, filterNode } = useTreeFilterHook(defaultProps.label, treeRef);
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
const executeClick = () => {
	let match = null;
	let paramList = <any>[];
	while ((match = defaultTagRE.exec(stringInput.value))) {
		let obj = {
			columnType: "number",
			defaultValue: null,
			fieldName: match[1],
			name: match[1],
			required: false,
		};
		paramList.push(obj);
	}
	console.log("paramList", paramList);
	if (paramList.length) {
		//解析变量
		parseParamListDialogRef.value.acceptParams({ list: paramList });
	} else {
		buildSql(paramList);
	}
};
const buildSql = (paramList) => {
	let dbObj = dbRawInfo.value.dbObj;
	let obj = <any>{};
	paramList.forEach((item: any) => {
		obj[item.name] = item.defaultValue;
	});
	let params = {
		paramIns: paramList,
		param: obj,
		apiBase: {
			databaseType: dbObj.type,
			isSql: 1,
			templateSql: stringInput.value,
		},
	};
	buildSQLApi(params)
		.then((res: any) => {
			// debugger;
			console.log("buildSQLApi", res.data);
			if (res.data) {
				discardSqlApi({
					uuid: "9" + new Date().getTime(),
					linkType: dbObj.type,
				}).then((res2: any) => {});

				queryForm1.value = {
					conn_id: dbObj.datasourceId,
					query: res.data,
					type: dbObj.type,
					uuid: "9" + new Date().getTime(),
				};
				searchByQueryForm1();
			} else {
				ElMessage.error("SQL生成异常");
			}
			// debugger;
		})
		.catch(() => {
			if (paramList.length) {
				parseParamListDialogRef.value.acceptParams({ list: paramList });
			}
		});
};
let stringInput = ref("");
const extensionsOpt = <any>ref([JSON()]);

const fullScreenShow = ref(false);
const activeTab = ref("col3Show");

const col2ShowInput = ref(false);
const col3ShowInput = ref(false);

let { asideClass, foldClick, expandClick } = useFoldOrExpandHook();
let { asideClass: asideClassRight, foldClick: foldClickRight, expandClick: expandClickRight } = useFoldOrExpandHook();
// debugger;

//#region 表格 查 相关

const beanInfo = {};
const queryFormRaw = {};
let {
	tableLoading: tableLoading1,

	pageParams: pageParams1,
	tableDataList: tableDataList1,
	tableDataListRaw,
	ddl,
	handleCurrentPageChange: handleCurrentPageChange1,
	handleSizeChange: handleSizeChange1,

	// refreshData, //刷新按钮

	searchByQueryForm: searchByQueryForm1,

	queryForm: queryForm1,
} = useListPageHook1(
	testExecSqlApi,

	beanInfo,
	queryFormRaw
);

const abstractParamsClick = () => {
	let match = null;
	let paramList = <any>[];
	let arr = stringInput.value.split("from");
	if (!arr[1]) {
		return;
	}
	let str1 = arr[1];
	let str0 = arr[0]; // before from
	let headStrArr = str0.split("select");
	if (!headStrArr[1]) {
		return;
	}
	str0 = headStrArr[1].trim(); //after select
	if (str0 === "") {
		return;
	}
	let str0Arr = str0.split(",");

	while ((match = defaultTagRE.exec(str1))) {
		let obj = {
			...queryParamRaw,

			columnType: "number",
			fieldName: match[1],
		};
		paramList.push(obj);
	}
	queryParamList.value = paramList;

	let returnList = <any>[];
	str0Arr.forEach((item: any) => {
		let obj = {
			...returnParamRaw,

			fieldName: item,
		};
		returnList.push(obj);
	});
	returnParamList.value = returnList;
};

const queryParamList = <any>ref([]); //
const returnParamList = <any>ref([]);
const queryParamRaw = {
	fieldName: "",
	description: "",
	columnType: "string",
	defaultValue: "",
	required: true,
};
const returnParamRaw = {
	fieldName: "",
	description: "",
};
const addRowCol3 = (scope: any) => {
	queryParamList.value.splice(scope.$index + 1, 0, { ...queryParamRaw });
};
const deleteRowCol3 = (scope: any) => {
	queryParamList.value.splice(scope.$index, 1);
};
const addRowCol2 = (scope: any) => {
	returnParamList.value.splice(scope.$index + 1, 0, { ...returnParamRaw });
};
const deleteRowCol2 = (scope: any) => {
	returnParamList.value.splice(scope.$index, 1);
};

defineExpose({
	queryParamList,
	returnParamList,
});
//#endregion
</script>

<style lang="scss" scoped>
* {
	box-sizing: border-box;
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
		// border-radius: 10px;
		background: #fff;
		padding: 16px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		border-right: 1px solid var(--bc);
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
		// border-radius: 10px;
		background: #fff;
		padding: 16px;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		border-left: 1px solid var(--bc);
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
