<template>
	<div class="common-layout-system">
		<el-form v-model="queryForm">
			<el-row>
				<el-col :span="24">
					<div class="wrap" style="display: flex">
						<el-form-item label="角色名称：">
							<el-input v-model="queryForm.name"></el-input>
						</el-form-item>

						<el-button type="primary" @click="searchByQueryForm">查询</el-button>
						<el-button @click="doReset">重置</el-button>
					</div>
				</el-col>
			</el-row>
		</el-form>

		<div class="operat-buttons">
			<el-button type="warning" v-permission="['roleManage:add']" icon="Plus" @click="openOrgDrawer('新建')">新建</el-button>
			<div class="space"></div>
		</div>

		<el-table
			v-loading="tableLoading"
			:data="tableDataList"
			cell-class-name="table-cell"
			header-cell-class-name="header-cell"
			border
			class="common-table"
		>
			<el-table-column label="角色名称" prop="name"></el-table-column>
			<el-table-column label="角色描述" prop="description"></el-table-column>
			<el-table-column label="创建人" prop="createBy"></el-table-column>
			<el-table-column label="更新时间" prop="updateTime"></el-table-column>
			<el-table-column label="操作" fixed="right">
				<template #default="scope">
					<el-button type="primary" v-authDisabled="['roleManage:detail']" link @click="openOrgDrawer('详情', scope.row)"
						>详情</el-button
					>
					<el-button
						type="primary"
						v-authDisabled="['roleManage:edit']"
						link
						@click="openOrgDrawer('编辑', scope.row)"
						:disabled="scope.row.name == '超级管理员'"
						>编辑</el-button
					>
				</template>
			</el-table-column>
		</el-table>
		<div class="pagination-block">
			<el-pagination
				:total="pageParams.total"
				:current-page="pageParams.pageNum"
				:page-size="pageParams.pageSize"
				@current-change="handleCurrentPageChange"
				layout="total, prev, pager, next, jumper"
				background
			>
			</el-pagination>
		</div>

		<RoleManageDrawer ref="roleManageDrawerRef" @refreshData="refreshData" />
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import useListPageHook from "@/hooks/listPage";
import RoleManageDrawer from "./components/RoleManageDrawer.vue";
import {
	getRoleListApi,
	addRoleApi,
	editRoleApi,
	getRoleDetailApi,
	getRoleMenuIdListApi,
} from "@/api/modules/systemManage/authorityCenter";

// 角色新建编辑抽屉
const roleManageDrawerRef = ref<InstanceType<typeof RoleManageDrawer> | null>(null);
const openOrgDrawer = (title: string, row: any = {}) => {
	console.log(title, row);
	let api;
	let renderApi;
	if (title === "新建") {
		api = addRoleApi;
	} else if (title === "编辑") {
		api = editRoleApi;
	}

	if (title === "编辑") {
		renderApi = getRoleMenuIdListApi;
	} else if (title === "详情") {
		renderApi = getRoleDetailApi;
	}
	console.warn(renderApi);
	const params = {
		title,
		isView: title === "详情",
		row: { ...row },
		api: api,
		renderApi: renderApi,
	};
	roleManageDrawerRef.value?.acceptParams(params);
};

// // 数据权限编辑抽屉
// const dataAuthorityroleManageDrawerRef = ref<InstanceType<typeof DataAuthorityDrawer> | null>(null);
// const openDataAuthorityDrawer = (row: any = {}) => {
// 	const params = {
// 		row: { ...row },
// 	};
// 	dataAuthorityroleManageDrawerRef.value?.acceptParams(params);
// };

const queryFormRaw = {
	name: "",
};

const beanInfo = {};

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
	getRoleListApi, //temp test

	beanInfo,
	queryFormRaw
);
</script>

<style lang="scss" scoped>
@import "@/styles/element";
</style>
