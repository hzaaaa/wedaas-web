<template>
	<div class="common-layout-system">
		<el-form v-model="queryForm">
			<el-row>
				<el-col :span="24">
					<div class="wrap" style="display: flex">
						<el-form-item label="用户搜索">
							<el-input v-model="queryForm.username" style="width: 320px" clearable suffix-icon="search"></el-input>
						</el-form-item>
						<!-- <el-button type="primary" @click="searchByQueryForm">查询</el-button>
						<el-button @click="doReset">重置</el-button> -->
						<div class="header-form-btn-group">
							<el-button type="warning" icon="Plus" @click="onAddDrawer('add')">新增用户</el-button>
						</div>
					</div>
				</el-col>
			</el-row>
		</el-form>

		<!-- <div class="operat-buttons">
			<el-button type="warning" icon="Plus" @click="openDrawer('新建')">新建</el-button>
			<div class="space"></div>
		</div> -->

		<el-table
			class="common-table"
			v-loading="tableLoading"
			:data="tableDataList"
			cell-class-name="table-cell"
			header-cell-class-name="header-cell"
			border
		>
			<el-table-column label="用户名" prop="dataBaseName"></el-table-column>
			<el-table-column label="员工号" prop="follow"></el-table-column>
			<el-table-column prop="tableName" label="姓名"></el-table-column>
			<el-table-column prop="dataSourceName" label="邮箱"></el-table-column>
			<el-table-column prop="dataCatalog" label="群组"></el-table-column>
			<el-table-column prop="desc" label="备注"></el-table-column>

			<el-table-column label="操作" width="410px" header-align="center" align="center">
				<template #default="scope">
					<!-- <el-button type="primary" link v-authDisabled="['authUser:edit']" @click="openDrawer('编辑', scope.row)"
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
					> -->
					<el-button type="primary" icon="Edit" link @click="onEdit(scope.row)"></el-button>
					<el-button type="primary" icon="Delete" link @click="deleteAccount(scope.row)"></el-button>
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
		<AddOrEditAccDrawer ref="drawer" :employeeRow="employeeRow" @confirmFunc="subData" />
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import useListPageHook from "@/hooks/listPage";
import { getAdvancedSearchListApi } from "@/api/modules/mock/mock";
import { ElMessage, ElMessageBox } from "element-plus";
import AddOrEditAccDrawer from "./components/AddOrEditAccDrawer.vue";

const changeEnableParam = (value: any) => {
	queryForm.value.enabled = value;
	searchByQueryForm();
	ElMessage.success("列表更新成功");
};

const deleteAccount = (row: any) => {
	ElMessageBox.confirm("此操作将永久删除该用户, 是否继续?", `提示`, {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		customClass: "delete-message",
	})
		.then(async () => {
			try {
				// await postCustomerAccountDeletionApi({ id: row.id });
				// ElMessage.success("删除成功");
				// refreshData();
			} catch (err) {
				console.error(err);
			}
		})
		.catch(() => {
			ElMessage.info("取消删除");
		});
};

const queryFormRaw = {
	username: "",
	enabled: null,
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
	getAdvancedSearchListApi,

	beanInfo,
	queryFormRaw
);

const onEdit = async (row: any) => {
	// let { data } = await getPartnerDetailsApi({ id: row.id });

	onEditDrawer(row);
};
</script>

<style lang="scss" scoped>
// @import "@/styles/element";
@import "./index";
</style>
