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
						<span>路径管理</span>
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
									{{ data.total }}
								</div>
								<div class="node-more mr8">
									<el-dropdown>
										<el-icon><MoreFilled /></el-icon>
										<template #dropdown>
											<el-dropdown-menu>
												<el-dropdown-item
													:key="data.key + '-add'"
													v-if="!data.childName"
													@click="openAddChildCatalogDialogRefClick(data.labelName)"
													>添加</el-dropdown-item
												>

												<el-dropdown-item :key="data.key + '-delete'" @click="removeCatalogClick(data)">删除</el-dropdown-item>
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
						<el-table-column show-overflow-tooltip label="API名称" prop="name">
							<template #default="scope">
								<span :key="scope.row.id" :underline="false" class="blue-link">{{ scope.row.name }}</span>
							</template>
						</el-table-column>

						<el-table-column show-overflow-tooltip prop="description" label="描述"> </el-table-column>
						<el-table-column show-overflow-tooltip prop="createBy" label="创建人"> </el-table-column>
						<el-table-column show-overflow-tooltip prop="createTime" label="创建时间">
							<template #default="scope">
								{{ momentC(scope.row.createTime * 1000).format("YYYY-MM-DD") }}
							</template>
						</el-table-column>
						<el-table-column show-overflow-tooltip prop="status" label="状态">
							<template #default="scope">
								<span
									:style="
										scope.row.status
											? {
													color: '#5dd8a2',
											  }
											: { color: '#ff6464' }
									"
								>
									{{ scope.row.status ? "已发布" : "未发布" }}
								</span>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
			<div class="pagination-block">
				<!-- <el-pagination
					:page-sizes="pageParams.pageSizesList"
					background
					layout="total,sizes,prev, pager, next,jumper"
					@size-change="handleSizeChange"
					@current-change="handleCurrentPageChange"
					:current-page="pageParams.pageNum"
					:page-size="pageParams.pageSize"
					:total="pageParams.total"
				/> -->
			</div>
		</div>
		<addMainCatalogDialog ref="addMainCatalogDialogRef" @refreshData="getCatalogInfo"></addMainCatalogDialog>
		<addChildCatalogDialog ref="addChildCatalogDialogRef" @refreshData="getCatalogInfo"></addChildCatalogDialog>
	</div>
</template>

<script setup lang="ts">
import useListPageHook from "../APICatalog/listPage";

import useTreeFilterHook from "@/views/dataCatalogMenu/dataCatalog/hooks/treeFilterHook";
import useIndexCatalogHook from "@/views/dataCatalogMenu/dataCatalog/hooks/indexCatalogHook";

import useFoldOrExpandHook from "@/hooks/foldOrExpandHook";
import addMainCatalogDialog from "./components/addMainCatalogDialog.vue";

import addChildCatalogDialog from "./components/addChildCatalogDialog.vue";

import { Search } from "@element-plus/icons-vue";

import { getApiListByPathApi } from "@/api/modules/dataApi/pathManage";
import { getApiPathListApi, delApiPathApi } from "@/api/modules/dataApi/pathManage";
import router from "@/routers";

const defaultProps = {
	children: "childTuple",
	label: "labelName",
};
let momentC = moment;
const show_mode = ref("list");
let treeDataJson = <any>ref({ data: [] });
const getCatalogInfo = (callBack?: any) => {
	getApiPathListApi({}).then((res: any) => {
		treeDataJson.value = res;

		treeData.value = [...treeDataJson.value.data];
		treeData.value.forEach((element: any) => {
			element.key = "/" + element.rootName + "";
			element.labelName = element.childName || element.rootName;
			element.total = element.total || element.rootTotal || 0;
			if (element.childTuple) {
				element.childTuple.forEach((item: any) => {
					item.key = "/" + item.rootName + "/" + item.childName;
					item.labelName = item.childName || item.rootName;
					item.total = item.total || item.rootTotal || 0;
				});
			}
		});

		// callBack && callBack();
		if (callBack) {
			callBack();
		} else {
			let data = treeData.value[0];

			queryForm.value.path = data.key;

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

	queryForm.value.path = data.key;

	searchByQueryForm();
};

const removeCatalogClick = (row: any) => {
	// debugger;
	console.log("removeCatalogClick", row);
	let title1 = "";
	let title2 = "";
	let deleteApi = <any>delApiPathApi;

	//child
	title1 = "此操作将永久删除路径,是否继续?此路径下创建的API不受影响";
	title2 = "路径";

	ElMessageBox.confirm(`${title1} `, `移除${title2}-${row.labelName}`, {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		customClass: "delete-message",
		// type: "warning",
	})
		.then(() => {
			//待续未完
			deleteApi({
				pathRoot: row.rootName,
				pathSecond: row.childName,
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
let {
	treeRef,
	addMainCatalogDialogRef,
	addChildCatalogDialogRef,

	openAddMainCatalogDialogClick,
	openAddChildCatalogDialogRefClick,
} = useIndexCatalogHook(treeDataJson, delApiPathApi, delApiPathApi, getCatalogInfo);
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

//#region 表格 查 相关

const beanInfo = {};
const queryFormRaw = {
	path: "",
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
} = useListPageHook(
	getApiListByPathApi,
	beanInfo,
	queryFormRaw,
	(obj1: any) => {
		let obj = { ...obj1 };

		let target = { wheres: { ...obj } };
		return target;
	},
	null
);

//#endregion
</script>

<style lang="scss" scoped>
:deep(.el-table.common-table.el-table--border .el-table__cell) {
	// box-sizing: border-box;
	// height: 56px;
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
