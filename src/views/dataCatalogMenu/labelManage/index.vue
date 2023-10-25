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
						<span>标签</span>
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
									{{ data.total }}
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
							<el-form-item label="数据源" style="padding-right: 40px">
								<el-input v-model="queryForm.name" placeholder="请输入" clearable style="width: 320px"></el-input>
							</el-form-item>
							<el-form-item label="搜索表" style="padding-right: 40px">
								<el-select v-model="queryForm.submitUserIdList" clearable placeholder="请选择" style="width: 320px" filterable>
									<!-- :remote-method=""
                :loading="" -->
									<el-option
										v-for="item in [
											{
												id: '创建时间排序',
												name: '创建时间排序',
											},
											{
												id: '调用次数排序',
												name: '调用次数排序',
											},
										]"
										:key="item.id"
										:label="item.name"
										:value="item.id"
									/>
								</el-select>
							</el-form-item>
							<el-button style="margin-right: 28px" type="primary" @click="searchByQueryForm">查询</el-button>
							<el-button style="margin-right: 28px" type="primary" plain @click="doReset">重置</el-button>

							<!-- <el-button style="margin-right: 28px" @click="show_mode = 'list'">列表模式</el-button>
							<el-button style="margin-right: 0" @click="show_mode = 'card'">卡片模式</el-button> -->
						</div>
					</el-col>
				</el-row>
			</el-form>
			<div class="operat-buttons">
				<el-button style="" type="warning" @click="openFormPageClick('add')">标签设置</el-button>
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
							<template #default="scope"> {{ scope.row.schema.split(".")[0] }}</template>
						</el-table-column>

						<el-table-column label="数据库" prop=" " show-overflow-tooltip-none>
							<template #default="scope"> {{ scope.row.schema.split(".")[1] }}</template>
						</el-table-column>
						<el-table-column prop="description" label="表描述" width="180"> </el-table-column>
						<el-table-column label="操作" width="80" header-align="left" align="left" fixed="right">
							<template #default="scope">
								<div class="flex-left">
									<span class="two-word-button">
										<el-button type="primary" link>删除</el-button>
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
		<addMainCatalogDialog ref="addMainCatalogDialogRef" @refreshData=""></addMainCatalogDialog>
		<addChildCatalogDialog ref="addChildCatalogDialogRef" @refreshData=""></addChildCatalogDialog>
		<modiftCatalogDialog ref="modiftCatalogDialogRef" @refreshData=""></modiftCatalogDialog>
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
import { Search } from "@element-plus/icons-vue";
import router from "@/routers";
interface Tree {
	label: string;
	children?: Tree[];
}
const defaultProps = {
	children: "childs",
	label: "rootName",
};
const addMainCatalogDialogRef = <any>ref(null);
const addChildCatalogDialogRef = <any>ref(null);
const modiftCatalogDialogRef = <any>ref(null);
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
	router.push({
		name: "setLabel",
	});
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
</style>
