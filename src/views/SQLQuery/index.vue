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
					<el-select class="mt16"></el-select>
					<el-input class="mt16" placeholder="请输入关键字" :suffix-icon="Search" />
					<div class="view-all">
						<span>表({{ treeData.length }})</span>
						<el-icon><RefreshRight /></el-icon>
					</div>
					<el-tree class="tree-class thin-scrollbar" :data="treeData" :props="defaultProps" @node-click="handleNodeClick" />
				</div>
			</Transition>
		</div>
		<div class="center-block">
			<div class="left-btns">
				<el-button :icon="CaretRight" circle />
				<el-button :icon="Folder" circle />
				<el-button :icon="Document" circle />
			</div>
			<div class="right-block">
				<div class="exec-time">执行时间 : 0s</div>
				<!-- <div class="data-base">
					<span class="key">Database</span>
					<el-select></el-select>
				</div> -->
				<div class="top-info">
					<span class="key">Database</span>
					<el-select></el-select>
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
						<el-icon><Download /></el-icon>
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
							<input v-show="activeTab === 'col2Show' && col2ShowInput" />
						</div>
						<div class="res-title" @click="activeTab = 'col3Show'" :class="activeTab === 'col3Show' ? 'res-title-active' : ''">
							<span>保存的查询</span>
							<el-icon :class="activeTab === 'col3Show' && col3ShowInput ? 'show' : ''" @click="col3ShowInput = !col3ShowInput"
								><Search
							/></el-icon>
							<input v-show="activeTab === 'col3Show' && col3ShowInput" />
						</div>
						<div class="res-title" @click="activeTab = 'col4Show'" :class="activeTab === 'col4Show' ? 'res-title-active' : ''">
							<span>历史导出</span><el-icon><Refresh /></el-icon>
						</div>
					</div>
					<div class="table-wrap">
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
						<div class="pagination-block" style="display: flex; justify-content: flex-end; margin-top: 16px">
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
			</div>
		</div>
		<div class="aside-right" :class="asideClassRight">
			<div class="action-btn-wrap">
				<el-icon class="icon" v-if="asideClassRight === 'wider-at-hook'" @click="foldClickRight"><Fold /></el-icon>
				<el-icon class="icon" v-if="asideClassRight === 'narrower-at-hook'" @click="expandClickRight"><Expand /></el-icon>
			</div>
			<Transition>
				<div class="content-wrap" v-show="asideClassRight === 'wider-at-hook'">
					<div class="title">渠道公司主体表</div>
					<div class="details">
						<div class="mt10" v-for="item in rightListDataJson.data">
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
				<div class="pagination-block" style="display: flex; justify-content: flex-end; margin-top: 16px">
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
	</div>
</template>

<script setup lang="ts">
import treeDataJson from "./treeData.json";
import listDataJson from "./listData.json";
import { Codemirror } from "vue-codemirror";
import { xml as XML } from "@codemirror/lang-xml";
import { html as HTML } from "@codemirror/lang-html";
import { json as JSON } from "@codemirror/lang-json";
import rightListDataJson from "./rightListData.json";
import useListPageHook from "@/hooks/listPage";
import useFoldOrExpandHook from "@/hooks/foldOrExpandHook";
import { Search, CaretRight, Folder, Document } from "@element-plus/icons-vue";
import router from "@/routers";
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
const fullScreenShow = ref(false);
const activeTab = ref("col1Show");

const col2ShowInput = ref(false);
const col3ShowInput = ref(false);

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
let { asideClass: asideClassRight, foldClick: foldClickRight, expandClick: expandClickRight } = useFoldOrExpandHook();
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
