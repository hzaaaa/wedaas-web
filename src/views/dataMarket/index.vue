<template>
	<div class="left-tree-right-table-layout">
		<div class="aside" :class="asideClass">
			<div class="action-btn-wrap">
				<el-icon v-if="asideClass === 'wider-at-hook'" @click="foldClick"><Fold /></el-icon>
				<el-icon v-if="asideClass === 'narrower-at-hook'" @click="expandClick"><Expand /></el-icon>
			</div>
			<Transition>
				<div class="tree-wrap" v-show="asideClass === 'wider-at-hook'">
					<div class="market-tabs">
						<div class="market-tabs-item pointer market-tabs-active">数据市场</div>
						<div class="market-tabs-item pointer">我的空间</div>
					</div>
					<div class="view-all">查看全部</div>
					<el-tree class="tree-class thin-scrollbar" :data="treeData" :props="defaultProps" @node-click="handleNodeClick" />
				</div>
			</Transition>
		</div>
		<div class="common-layout-right">
			<el-form :model="queryForm" class="query-form">
				<el-row>
					<el-col :span="24">
						<div class="wrap" style="display: flex">
							<el-form-item label="API名称" style="padding-right: 40px">
								<el-input v-model="queryForm.name" placeholder="请输入" clearable style="width: 320px"></el-input>
							</el-form-item>
							<el-form-item label="排序" style="padding-right: 40px">
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

							<el-button style="margin-right: 28px" @click="show_mode = 'list'">列表模式</el-button>
							<el-button style="margin-right: 0" @click="show_mode = 'card'">卡片模式</el-button>
						</div>
					</el-col>
				</el-row>
			</el-form>
			<div class="operat-buttons">
				<el-button style="" type="warning" @click="openFormPageClick('add')">我的申请</el-button>
				<!-- v-permission="['accessTestApi:add']" -->

				<div class="space"></div>
			</div>
			<div class="show-data-list" style="cursor: pointer">
				<div class="card-list thin-scrollbar" v-if="show_mode === 'card'">
					<!-- <el-scrollbar> 使用这个失去flex 特性 -->
					<div class="card-item" v-for="dataItem in tableDataList" @click="gotoDetails(dataItem)">
						<div class="header">
							<tooltipWrap :content="dataItem.name" class="header-right" type="x"></tooltipWrap>
						</div>

						<tooltipWrap :content="dataItem.description" class="description" type="y"></tooltipWrap>
						<div class="list-item">
							<tooltipWrap :content="dataItem.rootName + '/' + dataItem.childName" class="item-right" type="x"></tooltipWrap>
						</div>
						<div class="list-item">
							<div class="item-right mod-ellipsis">
								{{ dataItem.createBy }}
							</div>
						</div>
						<div class="list-item">
							<div class="item-right mod-ellipsis">
								{{ dataItem.createTime }}
							</div>
						</div>
						<div class="foot">
							<div class="foot-right">调用次数: {{ dataItem.executeCount }}</div>
						</div>
						<!-- content=" 教育网信息数据（教育代码、学校名称、是否双一流、是否985、是否211）  教育网信息数据（教育代码、学校名称、是否双一流、是否985、是否211） 教育网信息数据（教育代码、学校名称、是否双一流、是否985、是否211） 教育网信息数据（教育代码、学校名称、是否双一流、是否985、是否211）" -->
					</div>
				</div>
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
						<el-table-column label="API名称" prop="name" min-width="180" show-overflow-tooltip>
							<template #default="scope">
								<span :key="scope.row.id" :underline="false" class="blue-link">{{ scope.row.name }}</span>
							</template>
						</el-table-column>

						<el-table-column label="输出描述" prop="description" min-width="180" show-overflow-tooltip></el-table-column>

						<el-table-column label="创建人" prop="createBy" width="150" show-overflow-tooltip-none></el-table-column>
						<el-table-column prop="createTime" sortable="custom" label="创建时间" width="180">
							<template #default="scope">
								{{ scope.row.createTime }}
							</template>
						</el-table-column>
						<el-table-column prop="executeCount" label="调用次数" width="180">
							<template #default="scope">
								{{ scope.row.executeCount }}
							</template>
						</el-table-column>
						<el-table-column prop="status" label="审批状态" width="180">
							<template #default="scope">
								{{ scope.row.status }}
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
	</div>
</template>

<script setup lang="ts">
import treeDataJson from "./treeData.json";
import listDataJson from "./listData.json";
import useListPageHook from "@/hooks/listPage";
import useFoldOrExpandHook from "@/hooks/foldOrExpandHook";

import router from "@/routers";
interface Tree {
	label: string;
	children?: Tree[];
}
const defaultProps = {
	children: "childTuple",
	label: "labelName",
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
const treeData = ref(treeDataJson.data);
// treeData.value = [...treeData.value, ...treeData.value];
// treeData.value = [...treeData.value, ...treeData.value];
// treeData.value = [...treeData.value, ...treeData.value];
// treeData.value = [...treeData.value, ...treeData.value];
// treeData.value = [...treeData.value, ...treeData.value];
// treeData.value = [...treeData.value, ...treeData.value];
const handleNodeClick = (data: Tree) => {
	console.log(data);
};

let { asideClass, foldClick, expandClick } = useFoldOrExpandHook();
// debugger;
const openFormPageClick = (status: any, row?: any) => {
	// let pathName = pageName + "Api";
	// userStore.setBehavior(status);
	router.push({
		// name: pathName,
		// state: {
		// 	// params: { ...employeeRow.value },
		// },
		// query: {
		// 	id: row?.id,
		// },
	});
};
const gotoDetails = (row: any) => {
	router.push({
		name: "marketDetails",
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
	list = listDataJson.data;
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
			font-size: 13px;
			line-height: 1;
			color: #27272e;
			font-weight: 500;
			padding: 10px 8px;
			background: #f8f8f8;
			border-radius: 4px;
			margin: 8px 0;
		}
		.tree-class {
			flex: 1;
			height: 0;
			overflow: auto;
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
	@import "./index";
}
</style>
