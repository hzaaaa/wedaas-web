<template>
	<div class="explorationConfig">
		<div class="exploration-header">
			<div class="filter-input">
				<div class="title">正则名称搜索</div>
				<el-input
					@input="searchByQueryForm"
					v-model="queryForm.regularName"
					style="width: auto"
					placeholder="请输入查询的正则名称"
					:suffix-icon="Search"
				/>
			</div>
			<div class="add-btn">
				<el-button style="margin-bottom: 0" type="warning" @click="openRegularEditDialogClick('新增')">增加配置</el-button>
			</div>
		</div>
		<div class="exploration-table">
			<el-table
				class="common-table"
				v-loading="tableLoading"
				:data="tableDataList"
				border
				style="flex: 1 !important; height: auto"
				ref="multipleTableRef"
				:default-sort="{ prop: 'update_time', order: 'descending' }"
			>
				<el-table-column label="正则名称" prop="regularName" show-overflow-tooltip> </el-table-column>

				<el-table-column label="正则表达式" prop="regularExpression" show-overflow-tooltip-none> </el-table-column>

				<el-table-column label="描述" prop="regularDescription" show-overflow-tooltip-none> </el-table-column>

				<el-table-column label="创建时间" prop="createTime" show-overflow-tooltip-none> </el-table-column>
				<el-table-column label="更新时间" prop="updateTime" show-overflow-tooltip-none> </el-table-column>

				<el-table-column label="操作" width="120" header-align="left" align="left" fixed="right">
					<template #default="scope">
						<div class="flex-left">
							<span class="two-word-button">
								<el-button type="primary" link @click="openRegularEditDialogClick('修改', scope.row)">修改</el-button>
								<el-button type="info" class="button-hold-position" disabled link>修改</el-button>
							</span>
							<span class="two-word-button">
								<el-button type="primary" link @click="deleteClick(scope.row)">删除</el-button>
								<el-button type="info" class="button-hold-position" disabled link>删除</el-button>
							</span>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="exploration-page">
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

		<regularEditDialog ref="regularEditDialogRef" @refreshData="refreshData"></regularEditDialog>
	</div>
</template>

<script setup lang="ts">
import {} from "vue";
import { userRegularListApi, deleteUserRegularApi } from "@/api/modules/dataQuality/explorationConfig";
import useListPageHook from "@/hooks/listPage";

import regularEditDialog from "./components/regularEditDialog.vue";
import { Search } from "@element-plus/icons-vue";

const regularEditDialogRef = <any>ref(null);
const openRegularEditDialogClick = (title: string, row?: any) => {
	regularEditDialogRef.value.acceptParams({
		title,
		row: { ...row },
	});
};
const deleteClick = (row: any) => {
	ElMessageBox.confirm("是否删除该正则配置?", `删除正则名称-${row.regularName}`, {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		customClass: "delete-message",
		// type: "warning",
	})
		.then(() => {
			deleteUserRegularApi({
				id: row.id,
			}).then(() => {
				ElMessage.success("删除成功");
				refreshData();
			});
		})
		.catch(() => {});
};

const beanInfo = {};
const queryFormRaw = {
	regularName: "",
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
	userRegularListApi,

	beanInfo,
	queryFormRaw
);
</script>

<style lang="scss" scoped>
.explorationConfig {
	height: 0;
	flex: 1;
	display: flex;
	flex-direction: column;

	padding: 24px;
	background: #fff;
	border-radius: 4px;
	.exploration-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--bc);
		.filter-input {
			display: flex;
			align-items: center;
			.title {
				font-weight: 400;
				font-size: 13px;
				line-height: 16px;
				color: rgba(39, 39, 46, 0.7);
				margin-right: 8px;
			}
		}
	}
	.exploration-table {
		width: 100%;
		margin-top: 16px;
		flex: 1;
		height: 0;
		display: flex;
		flex-direction: column;
	}
	.exploration-page {
		padding-top: 16px;
		text-align: right;
		display: flex;
		justify-content: flex-end;
	}
}
</style>
