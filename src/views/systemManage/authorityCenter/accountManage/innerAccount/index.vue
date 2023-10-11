<template>
	<div class="common-layout-system">
		<el-form v-model="queryForm">
			<el-row>
				<el-col :span="24">
					<div class="wrap" style="display: flex">
						<el-form-item label="用户名：">
							<el-input v-model="queryForm.username" style="width: 320px" clearable></el-input>
						</el-form-item>
						<el-button type="primary" @click="searchByQueryForm">查询</el-button>
						<el-button @click="doReset">重置</el-button>
					</div>
				</el-col>
			</el-row>
		</el-form>

		<div class="operat-buttons">
			<el-button type="warning" v-permission="['authUser:add']" icon="Plus" @click="openDrawer('新建')">新建</el-button>
			<div class="space"></div>
		</div>

		<el-table
			class="common-table"
			v-loading="tableLoading"
			:data="tableDataList"
			cell-class-name="table-cell"
			header-cell-class-name="header-cell"
			border
		>
			<el-table-column label="用户名" prop="username"></el-table-column>
			<el-table-column label="姓名" prop="nickName"></el-table-column>
			<el-table-column prop="phone" label="联系方式"></el-table-column>
			<el-table-column prop="email" label="邮箱"></el-table-column>
			<el-table-column prop="roleName" label="角色"></el-table-column>
			<el-table-column prop="remark" label="备注"></el-table-column>
			<el-table-column prop="enabled" label="状态">
				<template #header>
					<div class="flex-align-center">
						状态
						<el-dropdown>
							<el-icon class="ml5"><Filter /></el-icon>
							<template #dropdown>
								<el-dropdown-menu>
									<el-dropdown-item @click="changeEnableParam(null)">全部</el-dropdown-item>
									<el-dropdown-item @click="changeEnableParam(1)">已启用</el-dropdown-item>
									<el-dropdown-item @click="changeEnableParam(0)">已停用</el-dropdown-item>
								</el-dropdown-menu>
							</template>
						</el-dropdown>
					</div>
				</template>
				<template #default="scope">
					<span v-if="scope.row.enabled === 1" style="color: #ff9e2e">{{ "已启用" }}</span>
					<span v-else style="color: #a8abb2">{{ "已停用" }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="410px" header-align="center" align="center">
				<template #default="scope">
					<el-button type="primary" link v-authDisabled="['authUser:edit']" @click="openDrawer('编辑', scope.row)"
						>编辑</el-button
					>
					<el-button type="primary" link v-authDisabled="['authUser:resetPassword']" @click="resetPwdInnerAccount(scope.row.id)"
						>重置密码</el-button
					>
					<el-button
						type="primary"
						link
						v-authDisabled="['authUser:roleAuthority']"
						@click="openRoleAuthorityDialog(scope.row.id, scope.row.roleId)"
						>角色权限</el-button
					>
					<el-button
						type="primary"
						link
						v-authDisabled="['authUser:dataAuthority']"
						@click="openDataAuthorityDrawer(scope.row)"
						:disabled="scope.row.roleName == '超级管理员'"
						>数据权限</el-button
					>
					<el-button
						type="primary"
						v-authDisabled="['authUser:enableDisable']"
						link
						@click="enableInnerAccount(scope.row.id, scope.row.enabled)"
						>{{ scope.row.enabled ? "停用" : "启用" }}</el-button
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
				:page-sizes="[10, 20, 30, 40]"
				@size-change="handleSizeChange"
				background
			>
			</el-pagination>
		</div>
		<AccountDrawer ref="drawerRef" @refreshData="refreshData" />
		<ResetPasswordDialog ref="resetPasswordDialogRef" @refreshData="refreshData" />
		<RoleAuthorityDialog ref="roleAuthorityDialogRef" @refreshData="refreshData" />
		<DataAuthorityDrawer ref="dataAuthorityDrawerRef" @refreshData="refreshData" />
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import useListPageHook from "@/hooks/listPage";
import AccountDrawer from "../components/AccountDrawer.vue";
import ResetPasswordDialog from "../components/ResetPasswordDialog.vue";
import RoleAuthorityDialog from "../components/RoleAuthorityDialog.vue";
import DataAuthorityDrawer from "../components/DataAuthorityDrawer.vue";
import {
	getInnerAccountListApi,
	resetPwdInnerAccountApi,
	enableInnerAccountApi,
	addInnerAccountApi,
	editInnerAccountApi,
	getRoleSelectorApi,
	setInnerAccountRoleApi,
} from "@/api/modules/systemManage/authorityCenter";
import { ElMessage } from "element-plus";

// 账户新建编辑抽屉
const drawerRef = ref<InstanceType<typeof AccountDrawer> | null>(null);
const openDrawer = (title: string, row: any = {}) => {
	console.log(title, row);
	const params = {
		title,
		isEdit: title === "编辑",
		row: { ...row },
		api: title === "新建" ? addInnerAccountApi : editInnerAccountApi,
	};
	drawerRef.value?.acceptParams(params);
};
// 重置密码弹窗
const resetPasswordDialogRef = ref<InstanceType<typeof ResetPasswordDialog> | null>(null);
const openResetPasswordDialog = (id: number, pwd: string) => {
	const params = {
		id: id,
		pwd: pwd,
	};
	resetPasswordDialogRef.value?.acceptParams(params);
};
// 角色权限编辑弹窗
const roleAuthorityDialogRef = ref<InstanceType<typeof RoleAuthorityDialog> | null>(null);
const openRoleAuthorityDialog = (id: number, roleId: number) => {
	const params = {
		roleId: roleId,
		userId: id,
		getRoleSelectorApi: getRoleSelectorApi,
		api: setInnerAccountRoleApi,
	};
	roleAuthorityDialogRef.value?.acceptParams(params);
};

// 数据权限编辑抽屉
const dataAuthorityDrawerRef = ref<InstanceType<typeof DataAuthorityDrawer> | null>(null);
const openDataAuthorityDrawer = (row: any = {}) => {
	const params = {
		row: { ...row },
	};
	dataAuthorityDrawerRef.value?.acceptParams(params);
};

//停用/启用内部用户
const enableInnerAccount = async (userId: number, enabled: number) => {
	const params = {
		userId: userId,
		enabled: enabled == 0 ? 1 : 0,
	};
	// console.log(params);
	try {
		await enableInnerAccountApi(params);

		// setTimeout(() => {
		refreshData();
		ElMessage.success("状态更新成功");
		// }, 2000);
	} catch (err) {
		console.log(err);
		// ElMessage.error("操作失败");
	}
};
// 重置密码
const resetPwdInnerAccount = async (userId: number) => {
	const params = {
		userId: userId,
	};

	try {
		const { data } = await resetPwdInnerAccountApi(params);
		ElMessage.success("重置密码成功");
		openResetPasswordDialog(userId, data);
	} catch (err) {
		console.log(err);
	}
};

const changeEnableParam = (value: any) => {
	queryForm.value.enabled = value;
	searchByQueryForm();
	ElMessage.success("列表更新成功");
};

const queryFormRaw = {
	username: "",
	enabled: null,
};

const beanInfo = {};

let {
	tableLoading,
	tableMaxHeight,
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
	getInnerAccountListApi,

	beanInfo,
	queryFormRaw
);
</script>

<style lang="scss" scoped>
@import "@/styles/element";
</style>
