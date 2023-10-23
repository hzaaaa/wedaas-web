<template>
	<div class="left-tree-right-table-layout">
		<div class="aside" :class="asideClass">
			<!-- <div class="action-btn-wrap">
				<el-icon v-if="asideClass === 'wider-at-hook'" @click="foldClick"><Fold /></el-icon>
				<el-icon v-if="asideClass === 'narrower-at-hook'" @click="expandClick"><Expand /></el-icon>
			</div> -->
			<Transition>
				<div class="tree-wrap" v-if="asideClass === 'wider-at-hook'">
					<div class="view-all">
						<span>目录</span>
						<el-icon @click="openAddMainCatalogDialogClick"><Plus /></el-icon>
					</div>
					<div class="aside-input">
						<el-input placeholder="请输入关键字" :suffix-icon="Search" />
					</div>
					<el-tree class="tree-class thin-scrollbar" :data="treeData" :props="defaultProps" @node-click="handleNodeClick">
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
												<el-dropdown-item @click="openAddChildCatalogDialogRefClick">添加</el-dropdown-item>
												<el-dropdown-item @click="openModiftCatalogDialogRefClick">修改</el-dropdown-item>
												<el-dropdown-item>删除</el-dropdown-item>
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
									<el-input style="width: auto" placeholder="请输入 " :suffix-icon="Search" />
								</div>
								<div class="input-item ml24">
									<span class="item-label">创建人 </span>
									<el-select style="width: auto"></el-select>
								</div>
								<div class="input-item ml24">
									<span class="item-label">创建时间</span>
									<el-select style="width: auto"></el-select>
								</div>
								<div class="input-item ml24" style="flex: 1; margin-right: 0; text-align: right">
									<el-button class="mr24" style="margin-bottom: 0" @click="openFormPageClick('add')">批量操作</el-button>
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
						@row-click="gotoDetails"
					>
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
											<el-dropdown-item @click="openApiDetailsDialogRefClick">查看</el-dropdown-item>
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
		<addMainCatalogDialog ref="addMainCatalogDialogRef" @refreshData=""></addMainCatalogDialog>
		<addChildCatalogDialog ref="addChildCatalogDialogRef" @refreshData=""></addChildCatalogDialog>
		<modiftCatalogDialog ref="modiftCatalogDialogRef" @refreshData=""></modiftCatalogDialog>
		<apiDetailsDialog ref="apiDetailsDialogRef" @refreshData=""></apiDetailsDialog>
		<getShareLinkDialog ref="getShareLinkDialogRef" @refreshData=""></getShareLinkDialog>
		<changeVersionDialog ref="changeVersionDialogRef" @refreshData=""></changeVersionDialog>
	</div>
</template>

<script setup lang="ts">
import treeDataJson from "./treeData.json";
import listDataJson from "./listData.json";
import useListPageHook from "@/hooks/listPage";
import useFoldOrExpandHook from "@/hooks/foldOrExpandHook";
import addMainCatalogDialog from "./components/addMainCatalogDialog.vue";
import addChildCatalogDialog from "./components/addChildCatalogDialog.vue";
import modiftCatalogDialog from "./components/modiftCatalogDialog.vue";
import apiDetailsDialog from "./components/apiDetailsDialog.vue";
import getShareLinkDialog from "./components/getShareLinkDialog.vue";
import changeVersionDialog from "./components/changeVersionDialog.vue";
import { Search } from "@element-plus/icons-vue";
import router from "@/routers";
interface Tree {
	label: string;
	children?: Tree[];
}
const defaultProps = {
	children: "childs",
	label: "name",
};
const addMainCatalogDialogRef = <any>ref(null);
const addChildCatalogDialogRef = <any>ref(null);
const modiftCatalogDialogRef = <any>ref(null);
const apiDetailsDialogRef = <any>ref(null);
const getShareLinkDialogRef = <any>ref(null);
const changeVersionDialogRef = <any>ref(null);
const openAddMainCatalogDialogClick = () => {
	addMainCatalogDialogRef.value.acceptParams({
		row: {},
	});
};
const openAddChildCatalogDialogRefClick = () => {
	addChildCatalogDialogRef.value.acceptParams({
		row: {},
	});
};
const openModiftCatalogDialogRefClick = () => {
	modiftCatalogDialogRef.value.acceptParams({
		row: {},
	});
};
const openApiDetailsDialogRefClick = () => {
	apiDetailsDialogRef.value.acceptParams({
		row: {},
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
const changeLabelName = (list: any) => {
	list.forEach((item: any) => {
		item.labelName = item.childName || item.rootName;
		console.log("item.labelName", item.labelName);
		if (item.childTuple) {
			changeLabelName(item.childTuple);
		}
	});
};
changeLabelName(treeDataJson.data);
const treeData = <any>ref(treeDataJson.data);
treeData.value = [...treeData.value, ...treeData.value];
treeData.value = [...treeData.value, ...treeData.value];
treeData.value = [...treeData.value, ...treeData.value];
treeData.value = [...treeData.value, ...treeData.value];
treeData.value = [...treeData.value, ...treeData.value];
treeData.value = [...treeData.value, ...treeData.value];
const handleNodeClick = (data: Tree) => {
	console.log(data);
};

let { asideClass, foldClick, expandClick } = useFoldOrExpandHook();
// debugger;
const openFormPageClick = (status: any, row?: any) => {
	// let pathName = pageName + "Api";
	// userStore.setBehavior(status);
	// router.push({
	// 	name: "setChildCatalog",
	// });
};
const gotoDetails = (row: any) => {
	router.push({
		// name: "setChildCatalog",
	});
};
//#region 表格 查 相关

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

//#endregion
</script>

<style lang="scss" scoped>
.left-tree-right-table-layout {
	flex: 1;
	height: 0;
	display: flex;
	width: 100%;
	.narrower-at-hook {
		width: 24px !important;

		padding: 10px 2px !important;
		.action-btn-wrap {
			justify-content: center !important;
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
