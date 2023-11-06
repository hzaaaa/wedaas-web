<template>
	<div class="left-tree-right-table-layout">
		<div class="aside" :class="asideClass">
			<!-- <div class="action-btn-wrap">
				<el-icon v-if="asideClass === 'wider-at-hook'" @click="foldClick"><Fold /></el-icon>
				<el-icon v-if="asideClass === 'narrower-at-hook'" @click="expandClick"><Expand /></el-icon>
			</div> -->
			<Transition>
				<div class="tree-wrap" v-show="asideClass === 'wider-at-hook'">
					<div class="view-all">
						<span>目录</span>
						<el-icon @click="openAddMainCatalogDialogClick"><Plus /></el-icon>
					</div>
					<div class="aside-input">
						<el-input placeholder="请输入关键字" v-model="filterText" :suffix-icon="Search" />
					</div>
					<el-tree
						ref="treeRef"
						class="tree-class thin-scrollbar"
						node-key="key"
						:data="treeData"
						:props="defaultProps"
						@node-click="handleNodeClick"
						:filter-node-method="filterNode"
					>
						<template #default="{ node, data }">
							<div class="custom-tree-node">
								<div class="custom-node-name mod-ellipsis">{{ node.label }}</div>
								<div class="custom-node-num ml8">
									{{ data.count }}
								</div>
								<div class="node-more mr8">
									<el-dropdown>
										<el-icon><MoreFilled /></el-icon>
										<template #dropdown>
											<el-dropdown-menu>
												<el-dropdown-item
													:key="data.id + '-add'"
													v-if="!data.rootId"
													@click="openAddChildCatalogDialogRefClick(data.name)"
													>添加</el-dropdown-item
												>
												<el-dropdown-item :key="data.id + '-modify'" @click="openModiftCatalogDialogRefClick(data)"
													>修改</el-dropdown-item
												>
												<el-dropdown-item :key="data.id + '-delete'" @click="removeCatalogClick(data)">删除</el-dropdown-item>
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
									<span class="item-label">API名称 </span>
									<el-input
										v-model="queryForm.apiName"
										@input="searchByQueryForm"
										style="width: auto"
										placeholder="请输入 "
										:suffix-icon="Search"
									/>
								</div>
								<div class="input-item ml24">
									<span class="item-label">创建人 </span>
									<el-select v-model="queryForm.createBy" @change="searchByQueryForm" style="width: auto">
										<el-option v-for="item in createByOptions" :key="item" :label="item" :value="item" />
									</el-select>
								</div>
								<div class="input-item ml24">
									<span class="item-label">创建时间</span>
									<el-select v-model="queryForm.fromDate" style="width: auto" @change="searchByQueryForm">
										<el-option
											v-for="item in ['最近一天', '最近一周', '最近一月', '最近一年']"
											:key="item"
											:label="item"
											:value="item"
										/>
									</el-select>
								</div>
								<div class="input-item ml24" style="flex: 1; margin-right: 0; text-align: right">
									<el-button
										type="warning"
										plain
										class="mr24"
										v-show="!isBatchOpt"
										style="margin-bottom: 0"
										@click="isBatchOpt = !isBatchOpt"
									>
										批量操作
									</el-button>
									<el-button
										type="warning"
										plain
										class="mr24"
										v-show="isBatchOpt"
										style="margin-bottom: 0"
										@click="cancelBatchOptClick"
									>
										取消操作
									</el-button>
									<el-button style="margin-bottom: 0" type="warning" @click="openFormPageClick('add')">添加API</el-button>
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
					>
						<el-table-column label=" " prop="" show-overflow-tooltip width="50" v-if="isBatchOpt">
							<template #default="scope">
								<el-checkbox
									:key="scope.row.id"
									@change="(value:any)=>checkedParamList[0].itemCheckedChange(value,scope.row)"
									v-model="scope.row.checked0"
									label=" "
									size="large"
								/>
							</template>
						</el-table-column>
						<el-table-column label="API名称" prop="name" show-overflow-tooltip> </el-table-column>

						<el-table-column label="数据源" prop="description" show-overflow-tooltip> </el-table-column>

						<el-table-column label="创建人" prop="createBy" show-overflow-tooltip-none></el-table-column>
						<el-table-column label="创建时间" prop="createTime" show-overflow-tooltip-none> </el-table-column>
						<el-table-column label="状态" prop="status" show-overflow-tooltip-none> </el-table-column>

						<el-table-column label="操作" width="80" header-align="left" align="left" fixed="right">
							<template #default="scope">
								<el-dropdown>
									<el-icon><MoreFilled /></el-icon>
									<template #dropdown>
										<el-dropdown-menu>
											<el-dropdown-item @click="openApiDetailsDialogRefClick(scope.row)">查看</el-dropdown-item>
											<el-dropdown-item>下线</el-dropdown-item>
											<el-dropdown-item>删除</el-dropdown-item>
											<el-dropdown-item>修改</el-dropdown-item>
											<el-dropdown-item>复制</el-dropdown-item>
											<el-dropdown-item @click="openGetShareLinkDialogRefClick">分享</el-dropdown-item>
											<el-dropdown-item @click="openChangeVersionDialogRefClick">版本切换</el-dropdown-item>
										</el-dropdown-menu>
									</template>
								</el-dropdown>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<div class="pagination-block" style="justify-content: space-between; flex-direction: row">
				<div class="">
					<template v-if="isBatchOpt && setSize0">
						<el-button class=" " style="margin-bottom: 0" @click=""> 删除 </el-button>
						<el-button text>取消</el-button>
						<span class="ml10" style="font-weight: 400; font-size: 13px; letter-spacing: 2px; color: var(--coloroptext)"
							>已选{{ setSize0 }}条数据
						</span>
					</template>
				</div>
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
		<addChildCatalogDialog ref="addChildCatalogDialogRef" @refreshData="getCatalogInfo"></addChildCatalogDialog>
		<modiftCatalogDialog ref="modiftCatalogDialogRef" @modifyName="modifyName"></modiftCatalogDialog>
		<apiDetailsDialog ref="apiDetailsDialogRef" @refreshData=""></apiDetailsDialog>
		<getShareLinkDialog ref="getShareLinkDialogRef" @refreshData=""></getShareLinkDialog>
		<changeVersionDialog ref="changeVersionDialogRef" @refreshData=""></changeVersionDialog>
	</div>
</template>
<script setup lang="ts">
import useListPageHook from "./listPage";
import useOptionsHook from "@/views/dataCatalogMenu/dataCatalog/hooks/optionsHook";
import useTreeFilterHook from "@/views/dataCatalogMenu/dataCatalog/hooks/treeFilterHook";
import useIndexCatalogHook from "@/views/dataCatalogMenu/dataCatalog/hooks/indexCatalogHook";

import useFoldOrExpandHook from "@/hooks/foldOrExpandHook";
import addMainCatalogDialog from "./components/addMainCatalogDialog.vue";

import modiftCatalogDialog from "./components/modiftCatalogDialog.vue";
import addChildCatalogDialog from "./components/addChildCatalogDialog.vue";
import apiDetailsDialog from "./components/apiDetailsDialog.vue";
import getShareLinkDialog from "./components/getShareLinkDialog.vue";
import changeVersionDialog from "./components/changeVersionDialog.vue";
import { Search } from "@element-plus/icons-vue";

import { apiManageListAPI, createbySelecterApi } from "@/api/modules/dataApi/apiCatalog";
import {
	getCatalogApi,
	deleteApiAtCatalogApi,
	delChildApiCatalogApi,
	delRootApiCatalogApi,
} from "@/api/modules/dataApi/apiCatalog";
import router from "@/routers";

const isBatchOpt = ref(false);
const cancelBatchOptClick = () => {
	isBatchOpt.value = false;
	checkedParamList[0].resetChecked();
};

const defaultProps = {
	children: "childs",
	label: "name",
};

const apiDetailsDialogRef = <any>ref(null);
const getShareLinkDialogRef = <any>ref(null);
const changeVersionDialogRef = <any>ref(null);

const openApiDetailsDialogRefClick = (row: any) => {
	apiDetailsDialogRef.value.acceptParams({
		row,
	});
};
const openGetShareLinkDialogRefClick = () => {
	getShareLinkDialogRef.value.acceptParams({
		row: {},
	});
};
const openChangeVersionDialogRefClick = () => {
	changeVersionDialogRef.value.acceptParams({
		row: {},
	});
};

const show_mode = ref("list");
let treeDataJson = <any>ref({ data: [] });
const getCatalogInfo = (callBack?: any) => {
	getCatalogApi({}).then((res: any) => {
		treeDataJson.value = res;

		treeData.value = [...treeDataJson.value.data];
		treeData.value.forEach((element: any) => {
			element.key = element.id + "";
			if (element.childs) {
				element.childs.forEach((item: any) => {
					item.key = item.rootId + "-" + item.id;
				});
			}
		});
		// callBack && callBack();
		if (callBack) {
			callBack();
		} else {
			let data = treeData.value[0];
			if (data.rootId) {
				queryForm.value.childId = data.id;
				queryForm.value.rootId = null;
			} else {
				queryForm.value.rootId = data.id;
				queryForm.value.childId = null;
			}

			nextTick(() => {
				// nextTick(() => {
				treeRef.value.setCurrentKey(treeData.value[0].key + "");
				// });
				// debugger;
			});
			searchByQueryForm();
		}
	});
};
getCatalogInfo();

const treeData = <any>ref([]);

const handleNodeClick = (data: any) => {
	console.log(data);

	if (data.rootId) {
		queryForm.value.childId = data.id;
		queryForm.value.rootId = null;
	} else {
		queryForm.value.rootId = data.id;
		queryForm.value.childId = null;
	}

	searchByQueryForm();
};
let {
	treeRef,
	addMainCatalogDialogRef,
	addChildCatalogDialogRef,
	modiftCatalogDialogRef,
	openAddMainCatalogDialogClick,
	openAddChildCatalogDialogRefClick,
	openModiftCatalogDialogRefClick,
	modifyName,
	removeCatalogClick,
} = useIndexCatalogHook(treeDataJson, delChildApiCatalogApi, delRootApiCatalogApi, getCatalogInfo);
let { filterText, filterNode } = useTreeFilterHook(defaultProps.label, treeRef);
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
			deleteApiAtCatalogApi({
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
	apiName: "",
	createBy: "",
	fromDate: null,
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
	apiManageListAPI,
	beanInfo,
	queryFormRaw,
	(obj1: any) => {
		let obj = { ...obj1 };
		obj.toDate = Math.floor(new Date().getTime());
		let fromDate = null;
		if (obj.fromDate === "最近一天") {
			fromDate = moment().subtract(1, "days").valueOf();
		} else if (obj.fromDate === "最近一周") {
			fromDate = moment().subtract(1, "weeks").valueOf();
		} else if (obj.fromDate === "最近一月") {
			fromDate = moment().subtract(1, "month").valueOf();
		} else if (obj.fromDate === "最近一年") {
			fromDate = moment().subtract(1, "years").valueOf();
		} else {
			fromDate = null;
		}
		obj.fromDate = fromDate;
		let target = { wheres: { ...obj } };
		return target;
	},
	null,
	[
		{
			key: "id",
			checkedBy: "checked0",
		},
	]
);
let addCheckedAll0 = checkedParamList[0].addCheckedAll;
let setSize0 = checkedParamList[0].setSize;
const createByOptions = ref<any>([]);
createbySelecterApi({}).then((res: any) => {
	createByOptions.value = res.data;
});
//#endregion
</script>

<style lang="scss" scoped>
:deep(.el-table.common-table.el-table--border .el-table__cell) {
	box-sizing: border-box;
	height: 56px;
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
