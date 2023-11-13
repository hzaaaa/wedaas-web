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
				<el-select
					value-key="a"
					style="display: inline-block; width: calc(46% - 100px)"
					v-model="dbRawInfo.tableObj"
					@change="tableChange"
				>
					<el-option v-for="item in treeData" :key="item.a" :label="item.b" :value="item"></el-option>
				</el-select>
			</div>

			<div class="btn-and-title">
				<div class="title">参数字段</div>
				<div class="btn-right" @click="openApiListDialogClick">已生成API {{ apiCount }}</div>
			</div>

			<el-table
				ref="colInfoRef"
				:data="colInfoList"
				style="width: 100%; flex: 1 !important; height: auto"
				class="common-table"
				@selection-change="handleColInfoSelectionChange"
				border
			>
				<el-table-column type="selection" width="55" />
				<el-table-column label="字段名" prop="colName" show-overflow-tooltip> </el-table-column>
				<el-table-column prop="colDesp" label="描述" show-overflow-tooltip />
				<el-table-column prop="colType" label="类型" show-overflow-tooltip />
			</el-table>
		</div>
		<div class="center-btns">
			<div class="btn btn1" @click="left2RightClick">
				<el-icon><ArrowRight /></el-icon>
			</div>
			<div class="btn btn2" @click="right2LeftClick">
				<el-icon><ArrowLeft /></el-icon>
			</div>
		</div>
		<div class="right-block">
			<div class="sql-result">
				<div class="res-types-title">
					<div
						class="res-title"
						@click="activeTab = 'queryListShow'"
						:class="activeTab === 'queryListShow' ? 'res-title-active' : ''"
					>
						<span> 请求参数</span>
					</div>
					<div
						class="res-title"
						@click="activeTab = 'returnListShow'"
						:class="activeTab === 'returnListShow' ? 'res-title-active' : ''"
					>
						<span>返回参数</span>
					</div>
					<div
						class="res-title"
						@click="activeTab = 'sortListShow'"
						:class="activeTab === 'sortListShow' ? 'res-title-active' : ''"
					>
						<span> 排序参数</span>
					</div>
				</div>
				<div class="table-wrap" v-show="activeTab === 'queryListShow'">
					<el-table
						ref="queryListRef"
						class="common-table"
						:data="queryParamList"
						border
						style="flex: 1 !important; height: auto"
						:default-sort="{ prop: 'update_time', order: 'descending' }"
						@selection-change="handleQuerySelectionChange"
					>
						<el-table-column type="selection" width="55" />

						<el-table-column label="字段名" prop="colName" show-overflow-tooltip> </el-table-column>
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
						<el-table-column prop="condition" label="条件" width="180">
							<template #default="scope">
								<el-select v-model="scope.row.condition" placeholder="请选择" style="width: 100%">
									<el-option v-for="item in ['>', '<', '=', '!=', '>=', '<=']" :key="item" :label="item" :value="item" />
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
					</el-table>
				</div>
				<div class="table-wrap" v-show="activeTab === 'returnListShow'">
					<el-table
						ref="returnListRef"
						class="common-table"
						:data="returnParamList"
						border
						style="flex: 1 !important; height: auto"
						:default-sort="{ prop: 'update_time', order: 'descending' }"
						@selection-change="handleReturnSelectionChange"
					>
						<el-table-column type="selection" width="55" />
						<el-table-column label="字段名" prop="name" min-width="180" show-overflow-tooltip>
							<template #default="scope">
								<span :key="scope.row.id" :underline="false" class="blue-link">{{ scope.row.name }}</span>
							</template>
						</el-table-column>

						<el-table-column label="描述" prop="description" min-width="180" show-overflow-tooltip></el-table-column>

						<el-table-column prop="createTime" label="类型" width="180">
							<template #default="scope">
								{{ scope.row.createTime }}
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="table-wrap" v-show="activeTab === 'sortListShow'">
					<el-table
						ref="sortListRef"
						class="common-table"
						:data="sortParamList"
						border
						style="flex: 1 !important; height: auto"
						:default-sort="{ prop: 'update_time', order: 'descending' }"
						@selection-change="handleSortSelectionChange"
					>
						<el-table-column type="selection" width="55" />
						<el-table-column label="字段名" prop="name" min-width="180" show-overflow-tooltip>
							<template #default="scope">
								<span :key="scope.row.id" :underline="false" class="blue-link">{{ scope.row.name }}</span>
							</template>
						</el-table-column>

						<el-table-column label="描述" prop="description" min-width="180" show-overflow-tooltip></el-table-column>

						<el-table-column prop="createTime" label="类型" width="180">
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
import useParamsCodeHookfrom from "@/views/SQLQuery/hooks/paramsCodeHook";
import useListPageHook from "@/hooks/listPage";
import listDataJson from "./listData.json";
import apiListDialog from "./apiListDialog.vue";
import { tablesForQueryByUserIdNoPageApi, getColsInfoApi, getApiListQueryBytableNameApi } from "@/api/modules/sqlQuery/index";
let {
	dbRawInfo,
	dsOptions,
	dataBaseOptions,
	treeData,
	defaultProps,
	colInfoList,
	apiCount,

	dsNameChange,
	getDataBaseOptionsMethod,
	dbChange,
	tableChange,
	handleNodeClick,
} = useParamsCodeHookfrom(tablesForQueryByUserIdNoPageApi, getColsInfoApi, true);

const apiListDialogRef = <any>ref(null);
const openApiListDialogClick = () => {
	if (apiCount.value === 0) {
		ElMessage.warning("API total is 0");
		return;
	}
	let dbObj = dbRawInfo.value.dbObj;
	let tableObj = dbRawInfo.value.tableObj;
	apiListDialogRef.value.acceptParams({
		row: {
			datasourceId: dbObj.datasourceId,
			dbType: dbObj.type,
			tablesName: tableObj.b,
		},
	});
};
const colInfoRef = <any>ref(null);
const colInfoMultipleSelection = <any>ref([]);
const handleColInfoSelectionChange = (val: any) => {
	colInfoMultipleSelection.value = val;
};
const queryListRef = <any>ref(null);
const queryListMultipleSelection = <any>ref([]);
const handleQuerySelectionChange = (val: any) => {
	queryListMultipleSelection.value = val;
};
const returnListRef = <any>ref(null);
const returnListMultipleSelection = <any>ref([]);
const handleReturnSelectionChange = (val: any) => {
	returnListMultipleSelection.value = val;
};
const sortListRef = <any>ref(null);
const sortListMultipleSelection = <any>ref([]);
const handleSortSelectionChange = (val: any) => {
	sortListMultipleSelection.value = val;
};

const activeTab = ref("queryListShow");
const queryParamList = <any>ref([]);
const returnParamList = <any>ref([]);
const sortParamList = <any>ref([]);
let name2objMap = <any>{
	queryListShow: {
		ref: queryListRef,
		multipleSelection: queryListMultipleSelection,
		tableList: queryParamList,
		rawObj: {},
	},
	returnListShow: {
		ref: returnListRef,
		tableList: returnParamList,
		rawObj: {},
	},
	sortListShow: {
		ref: sortListRef,
		tableList: sortParamList,
		rawObj: {},
	},
};
const left2RightClick = () => {
	let obj = name2objMap[activeTab.value];

	obj.tableList.value = [...obj.tableList.value, ...colInfoMultipleSelection.value];
	colInfoRef.value.clearSelection();
};
const right2LeftClick = () => {
	let obj = name2objMap[activeTab.value];

	obj.tableList.value = obj.tableList.value.filter((item: any) => {
		let isOut = obj.multipleSelection.value.every((selectItem: any) => {
			// debugger;
			return selectItem.colName !== item.colName;
		});
		return isOut;
	});
	obj.ref.value.clearSelection();
};
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
