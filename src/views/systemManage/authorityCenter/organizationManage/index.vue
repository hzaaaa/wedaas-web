<template>
	<div class="common-layout-system">
		<el-form v-model="queryForm">
			<el-row>
				<el-col :span="24">
					<div class="wrap" style="display: flex">
						<el-form-item label="组织名称：">
							<el-input v-model="queryForm.name"></el-input>
						</el-form-item>

						<el-button type="primary" @click="searchByQueryForm">查询</el-button>
						<el-button @click="doReset">重置</el-button>
					</div>
				</el-col>
			</el-row>
		</el-form>

		<div class="operat-buttons">
			<el-button type="warning" v-permission="['organization:add']" icon="Plus" @click="openOrgDrawer('新建')">新建</el-button>
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
			<el-table-column label="组织名称" prop="name"></el-table-column>
			<el-table-column label="合作方" prop="partnerName"></el-table-column>
			<el-table-column label="组织描述" prop="description"></el-table-column>
			<el-table-column label="有效期" prop="expirationTime"></el-table-column>
			<!-- <el-table-column label="授权IP" prop="ipList"></el-table-column> -->
			<el-table-column label="创建人" prop="createBy"></el-table-column>
			<el-table-column label="更新时间" prop="updateDate"></el-table-column>
			<el-table-column label="操作" width="254px" fixed="right">
				<template #default="scope">
					<el-button type="primary" v-authDisabled="['organization:edit']" link @click="openOrgDrawer('编辑', scope.row)"
						>编辑</el-button
					>
					<el-button
						type="primary"
						v-authDisabled="['organization:expirationDate']"
						link
						@click="openEditValidDateDialog(scope.row.id, scope.row.expirationTime)"
						>有效期</el-button
					>
					<!-- <el-button type="primary" v-authDisabled="['organization:ip']" link @click="openIPManageDrawer(scope.row.id)">IP管理</el-button> -->
					<el-button type="primary" v-authDisabled="['organization:delete']" link @click="deleteOrg(scope.row)">删除</el-button>
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
				background
			>
			</el-pagination>
		</div>

		<OrgAddOrEditDrawer ref="orgAddOrEditDrawerRef" @refreshData="refreshData" />
		<EditValidDateDialog ref="editValidDateDialogRef" @refreshData="refreshData" />
		<IPManageDrawer ref="IPManageDrawerRef" @refreshData="refreshData" />
	</div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import useListPageHook from "@/hooks/listPage";
import OrgAddOrEditDrawer from "./components/OrgAddOrEditDrawer.vue";
import EditValidDateDialog from "./components/EditValidDateDialog.vue";
import IPManageDrawer from "./components/IPManageDrawer.vue";
import { getOrganizationListApi, deleteOrganizationApi } from "@/api/modules/systemManage/authorityCenter";
import { ElMessage, ElMessageBox } from "element-plus";

// 账户新建编辑抽屉
const orgAddOrEditDrawerRef = ref<InstanceType<typeof OrgAddOrEditDrawer> | null>(null);
const openOrgDrawer = (title: string, row: any = {}) => {
	console.log(title, row);
	const params = {
		title,
		isEdit: title === "编辑",
		row: { ...row },
	};
	orgAddOrEditDrawerRef.value?.acceptParams(params);
};
// 编辑有效期弹窗
const editValidDateDialogRef = ref<InstanceType<typeof EditValidDateDialog> | null>(null);
const openEditValidDateDialog = (id: number, expirationTime: string) => {
	const params = {
		expirationTime: expirationTime,
		id: id,
	};
	editValidDateDialogRef.value?.acceptParams(params);
};
// 编辑IP抽屉
const IPManageDrawerRef = ref<InstanceType<typeof IPManageDrawer> | null>(null);
const openIPManageDrawer = (id: number) => {
	const params = <any>{
		id: id,
	};
	IPManageDrawerRef.value?.acceptParams(params);
};

// 删除组织
const deleteOrg = async (row: any) => {
	// try {
	// 	await deleteOrganizationApi(id);
	// 	refreshData;
	// } catch (err) {
	// 	console.log(err);
	// }
	console.log("delete", row);
	ElMessageBox.confirm("确定删除该组织信息吗？", `删除组织-${row.name}`, {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		customClass: "delete-message",
		// type: "warning",
	})
		.then(() => {
			//待续未完

			deleteOrganizationApi(row.id).then(() => {
				console.log("delete success", row);
				ElMessage({
					type: "success",
					message: "删除成功",
				});
				refreshData();
			});
		})
		.catch(() => {
			// ElMessage({
			//   type: 'info',
			//   message: 'Delete canceled',
			// })
		});
};

// // 数据权限编辑抽屉
// const dataAuthorityorgAddOrEditDrawerRef = ref<InstanceType<typeof DataAuthorityDrawer> | null>(null);
// const openDataAuthorityDrawer = (row: any = {}) => {
// 	const params = {
// 		row: { ...row },
// 	};
// 	dataAuthorityorgAddOrEditDrawerRef.value?.acceptParams(params);
// };

// const tableData = ref([
// 	{
// 		orgId: 1,
// 		orgName: "组织A",
// 		collaborator: "合作方A",
// 		orgDescription: "asdasd",
// 		dateRange: ["2023/03/21", "2024/03/24"],
// 		authorityIPList: [
// 			{ IPAddress: "27.38.202.11", remark: "1" },
// 			{ IPAddress: "163.125.202.218", remark: "2" },
// 		],
// 		createName: "张三",
// 		createTime: "2023/03/21 14:32:56",
// 		id: 1,
// 	},
// ]);
const queryFormRaw = {
	name: "",
};
// const getTableListApi = async (params: any) => {
// 	// console.log({ ...params });
// 	// return new Promise((resolve, reject) => {
// 	// 	setTimeout(() => {
// 	// 		resolve({
// 	// 			data: {
// 	// 				total: params.pageSize * 2,
// 	// 				list: tableData.value,
// 	// 			},
// 	// 		});
// 	// 	}, 500);
// 	// });
// 	try {
// 		await getOrganizationListApi(params);
// 	} catch(err) {

// 		console.log(err)
// 	}

// };
const beanInfo = {
	// id: "",
	// name: "",
};

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
	getOrganizationListApi, //temp test

	beanInfo,
	queryFormRaw
);
</script>

<style lang="scss" scoped>
@import "@/styles/element";
</style>
