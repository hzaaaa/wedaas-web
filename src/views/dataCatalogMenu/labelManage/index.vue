<template>
	<div class="left-tree-right-table-layout">
		<div class="aside" :class="asideClass">
			<Transition>
				<div class="tree-wrap" v-show="asideClass === 'wider-at-hook'">
					<div class="view-all">
						<span>标签</span>
						<el-icon @click="openAddMainCatalogDialogClick"><Plus /></el-icon>
					</div>
					<div class="aside-input">
						<el-input placeholder="请输入关键字" v-model="filterText" :suffix-icon="Search" />
					</div>
					<el-tree
						ref="treeRef"
						class="tree-class thin-scrollbar"
						node-key="rootId"
						:data="treeData"
						:props="defaultProps"
						@node-click="handleNodeClick"
						:filter-node-method="filterNode"
					>
						<template #default="{ node, data }">
							<div class="custom-tree-node">
								<div class="custom-node-name mod-ellipsis">{{ node.label }}</div>
								<div class="custom-node-num ml8">
									{{ data.total }}
								</div>
								<div class="node-more mr8">
									<el-dropdown>
										<el-icon><MoreFilled /></el-icon>
										<template #dropdown>
											<el-dropdown-menu>
												<el-dropdown-item @click="openModiftCatalogDialogRefClick(data)">修改</el-dropdown-item>
												<el-dropdown-item @click="removeCatalogClick(data)">删除</el-dropdown-item>
											</el-dropdown-menu>
										</template>
									</el-dropdown>
								</div>
							</div>
						</template>
					</el-tree>
				</div>
			</Transition>
		</div>
		<div class="common-layout-right">
			<el-form :model="queryForm" class="query-form">
				<el-row>
					<el-col :span="24">
						<div class="wrap" style="display: flex">
							<div class="query-bottom">
								<div class="input-item">
									<span class="item-label">数据源</span>
									<el-select style="width: auto" v-model="queryForm.dsName" @change="dsNameChange" clearable>
										<el-option v-for="item in dataSourceOptions" :key="item.dsName" :label="item.dsName" :value="item.dsName" />
									</el-select>
								</div>
								<div class="input-item">
									<el-select style="width: auto" v-model="queryForm.dbName" @change="searchByQueryForm" clearable>
										<el-option v-for="item in dataBaseOptions" :key="item.c" :label="item.c" :value="item.c" />
									</el-select>
								</div>
								<div class="input-item ml24">
									<span class="item-label">搜索表</span>
									<el-input style="width: auto" v-model="queryForm.tableName" @input="searchByQueryForm"></el-input>
								</div>
								<div class="input-item ml24" style="flex: 1; margin-right: 0; text-align: right">
									<el-button style="margin-bottom: 0" type="warning" @click="openFormPageClick('add')">标签设置</el-button>
								</div>
							</div>

							<!-- <el-button style="margin-right: 28px" @click="show_mode = 'list'">列表模式</el-button>
							<el-button style="margin-right: 0" @click="show_mode = 'card'">卡片模式</el-button> -->
						</div>
					</el-col>
				</el-row>
			</el-form>
			<div class="operat-buttons">
				<!-- v-permission="['accessTestApi:add']" -->

				<div class="space"></div>
			</div>
			<div class="show-data-list" style="cursor: pointer">
				<div class="table-list" v-if="show_mode === 'list'">
					<el-table
						class="common-table"
						v-loading="tableLoading"
						:data="tableDataList"
						border
						style="flex: 1 !important; height: auto"
						ref="multipleTableRef"
						:default-sort="{ prop: 'update_time', order: 'descending' }"
						@row-click="gotoDetails"
					>
						<el-table-column label="表名" prop="tableName" show-overflow-tooltip>
							<template #default="scope">
								<span :key="scope.row.id" :underline="false" class="blue-link">{{ scope.row.tableName }}</span>
							</template>
						</el-table-column>

						<el-table-column label="数据源" prop="" show-overflow-tooltip>
							<template #default="scope"> {{ scope.row.datasourceId.split(".")[0] }}</template>
						</el-table-column>

						<el-table-column label="数据库" prop="dbName" show-overflow-tooltip-none>
							<template #default="scope"> {{ scope.row.dbName }}</template>
						</el-table-column>
						<el-table-column prop="tableDesription" label="表描述" width="180"> </el-table-column>
						<el-table-column label="操作" width="80" header-align="left" align="left" fixed="right">
							<template #default="scope">
								<div class="flex-left">
									<span class="two-word-button">
										<el-button type="primary" @click="deleteRowData(scope.row)" link>删除</el-button>
										<el-button type="info" class="button-hold-position" disabled link>删除</el-button>
									</span>
								</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<div class="pagination-block">
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
		<addMainCatalogDialog ref="addMainCatalogDialogRef" @refreshData="getCatalogInfo"></addMainCatalogDialog>

		<modiftCatalogDialog ref="modiftCatalogDialogRef" @modifyName="modifyName"></modiftCatalogDialog>
	</div>
</template>

<script setup lang="ts">
import useListPageHook from "@/hooks/listPage";
import useOptionsHook from "@/views/dataCatalogMenu/dataCatalog/hooks/optionsHook";
import useTreeFilterHook from "@/views/dataCatalogMenu/dataCatalog/hooks/treeFilterHook";

import useFoldOrExpandHook from "@/hooks/foldOrExpandHook";
import addMainCatalogDialog from "./components/addMainCatalogDialog.vue";

import modiftCatalogDialog from "./components/modiftCatalogDialog.vue";
import { Search } from "@element-plus/icons-vue";

import { selectListByLableIdApi } from "@/api/modules/dataCatalog/labelManage";
import { getLabelListApi, deleteEditLabelInfoApi, deleteLabelApi } from "@/api/modules/dataCatalog/labelManage";
import router from "@/routers";

interface Tree {
	label: string;
	children?: Tree[];
}
const defaultProps = {
	children: "childs",
	label: "rootName",
};

const treeRef = ref<any>(null);
let { filterText, filterNode } = useTreeFilterHook(defaultProps.label, treeRef);

const addMainCatalogDialogRef = <any>ref(null);

const modiftCatalogDialogRef = <any>ref(null);
const openAddMainCatalogDialogClick = () => {
	addMainCatalogDialogRef.value.acceptParams({
		row: {},
	});
};

let modifyTempData = <any>null; //tree node data ref
const openModiftCatalogDialogRefClick = (data: any) => {
	// debugger;
	modifyTempData = data;
	modiftCatalogDialogRef.value.acceptParams({
		row: data,
	});
};
const modifyName = (name: any) => {
	modifyTempData.rootName = name;
};
const removeCatalogClick = (row: any) => {
	// debugger;
	console.log("removeCatalogClick", row);
	let title1 = "";
	let title2 = "";
	let deleteApi = <any>deleteLabelApi;

	title1 = "此操作将永久删除该标签";
	title2 = "";

	ElMessageBox.confirm(`${title1}, 是否继续?`, `移除${title2}-${row.rootName}`, {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		customClass: "delete-message",
		// type: "warning",
	})
		.then(() => {
			//待续未完
			deleteApi({
				id: row.rootId,
			}).then(() => {
				console.log("delete success", row);
				ElMessage({
					type: "success",
					message: "删除成功",
				});

				getCatalogInfo();
			});
		})
		.catch(() => {});
};

const show_mode = ref("list");
let treeDataJson = <any>{ data: [] };
const getCatalogInfo = (callBack?: any) => {
	getLabelListApi({}).then((res: any) => {
		treeDataJson = res;

		treeData.value = [...treeDataJson.data];

		// callBack && callBack();
		if (callBack) {
			callBack();
		} else {
			queryForm.value.id = treeData.value[0].rootId;

			nextTick(() => {
				treeRef.value.setCurrentKey(treeData.value[0].rootId + "");
			});
			searchByQueryForm();
		}
	});
};
getCatalogInfo();

const treeData = <any>ref(treeDataJson.data);

const handleNodeClick = (data: any) => {
	console.log(data);

	queryForm.value.id = data.rootId;
	searchByQueryForm();
};

let { asideClass, foldClick, expandClick } = useFoldOrExpandHook();
// debugger;
const openFormPageClick = (status: any, row?: any) => {
	let node = treeRef.value.getCurrentNode();

	router.push({
		name: "setLabel",
		state: {
			params: { ...node },
		},
	});
};
const gotoDetails = (row: any) => {
	router.push({
		// name: "setChildCatalog",
	});
};

const deleteRowData = (row: any) => {
	console.log("delete", row);
	ElMessageBox.confirm("此操作将移除表, 是否继续?", `移除表-${row.tableName}`, {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		customClass: "delete-message",
		// type: "warning",
	})
		.then(() => {
			// debugger;
			let label = treeData.value.find((item: any) => {
				return item.rootId === queryForm.value.id;
			}).rootName;
			// debugger;
			deleteEditLabelInfoApi({
				id: queryForm.value.id,
				label,
				table_list: row.tableId,
			}).then(() => {
				console.log("delete success", row);
				ElMessage({
					type: "success",
					message: "删除成功",
				});
				refreshData();
				// getCatalogInfo();
				//更新并选中树节点
				let key = treeRef.value.getCurrentKey();
				getCatalogInfo(() => {
					// 更新并选中树节点
					nextTick(() => {
						treeRef.value.setCurrentKey(key);
					});
				});
			});
		})
		.catch(() => {});
};

//#region 表格 查 相关

const beanInfo = {};
const queryFormRaw = {
	dsName: "",
	dbName: "",
	tableName: "",
	id: null, //
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
} = useListPageHook(selectListByLableIdApi, beanInfo, queryFormRaw, null, null);

let { dataSourceOptions, dataBaseOptions, dsNameChange } = useOptionsHook(queryForm, searchByQueryForm);
//#endregion
</script>

<style lang="scss" scoped>
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
	.narrower-at-hook {
		width: 24px !important;

		padding: 10px 2px !important;
		padding-right: 4px !important;
		.action-btn-wrap {
		}
	}

	.aside {
		transition: all 0.3s;
		width: 240px;
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
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 8px 16px;
			background: var(--titlebg);
			border-radius: 4px;
			font-style: normal;
			font-weight: 500;
			font-size: 13px;
			line-height: 16px;
			color: var(--colormaintext);
		}
		.aside-input {
			margin-top: 16px;
			box-sizing: border-box;
			border-radius: 4px;
		}
		.tree-class {
			flex: 1;
			height: 0;
			overflow: auto;
			margin-top: 16px;
			.custom-tree-node {
				display: flex;
				width: 100%;
				align-items: center;
				&:hover {
					.node-more {
						display: block !important;
					}
				}
				.custom-node-name {
					max-width: 120px;
				}
				.custom-node-num {
					font-weight: 500;
					font-size: 12px;
					color: #27272e;
					background: #f8f8f8;
					border-radius: 2px;
					padding: 1px 4px;
					margin-left: 8px;
					transform: scale(0.75);
					transform-origin: left center;
				}
				.node-more {
					flex: 1;
					text-align: right;
					display: none;
					align-items: center;
					// display: flex;
					justify-content: flex-end;
				}
			}
		}
	}
	.content {
		flex: 1;
		height: 100%;
		border-radius: 10px;
		background: #fff;
		display: flex;
		flex-direction: column;
	}
	@import "@/views/dataMarket/index.scss";
}
.query-bottom {
	width: 100%;
	display: flex;
	justify-content: flex-start;
	align-items: center;

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
</style>
