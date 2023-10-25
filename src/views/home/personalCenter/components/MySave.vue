<template>
	<div class="common-layout-system">
		<div class="table-wrapper">
			<el-table
				v-loading="tableLoading"
				:data="tableDataList"
				cell-class-name="table-cell"
				header-cell-class-name="header-cell"
				class="common-table"
				show-overflow-tooltip
				border
			>
				<el-table-column label="文件名称" prop="tableName">
					<!-- <template #default="scope">
						<div class="table-icon-text" @click="openTableDetailPage">
							<el-icon color="blue"><Calendar /></el-icon><span>{{ scope.row.tableName }}</span>
						</div>
						<div>
							<el-icon><Coin /></el-icon><span>{{ scope.row.dataBaseName }}</span>
						</div>
					</template> -->
				</el-table-column>
				<el-table-column label="SQL语句" prop="dataSourceName">
					<!-- <template #default="scope">
						<div>
							<span>描述:</span><span>{{ scope.row.desc }}</span>
						</div>
						<div>
							<span>数据源:</span><span>{{ scope.row.dataSourceName }}</span>
						</div>
					</template> -->
				</el-table-column>
				<el-table-column label="数据库" prop="dataBaseName">
					<!-- <template #default="scope">
						<div>
							<el-icon color="blue"><Suitcase /></el-icon><span>{{ scope.row.dataCatalog }}</span>
						</div>
					</template> -->
				</el-table-column>
				<el-table-column label="创建时间" prop="dataBaseName">
					<!-- <template #default="scope">
						<div>
							<el-icon color="blue"><Suitcase /></el-icon><span>{{ scope.row.dataCatalog }}</span>
						</div>
					</template> -->
				</el-table-column>
				<el-table-column label="操作" fixed="right">
					<template #default="scope">
						<!-- <el-button type="primary" v-authDisabled="['roleManage:detail']" link @click="openOrgDrawer('详情', scope.row)"
							>详情</el-button
						> -->
						<!-- <el-button
						type="primary"
						v-authDisabled="['roleManage:edit']"
						link
						@click="openOrgDrawer('编辑', scope.row)"
						:disabled="scope.row.name == '超级管理员'"
						>编辑</el-button
					> -->
						<!-- <div>
							<el-icon :color="scope.row.follow ? 'blue' : ''"><Star /></el-icon><span>关注</span>
						</div> -->
						<el-icon @click="openeditViewSQLDialog('edit', scope.row.dataSourceName)"><Edit /></el-icon>
						<el-icon @click="openeditViewSQLDialog('view', scope.row.dataSourceName)"><View /></el-icon>
						<el-icon @click="deleteMySave(scope.row)"><Delete /></el-icon>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<div class="pagination-block">
			<el-pagination
				:total="pageParams.total"
				:current-page="pageParams.pageNum"
				:page-size="pageParams.pageSize"
				@current-change="handleCurrentPageChange"
				layout="slot,->, prev, pager, next, jumper"
				background
			>
				<span class="pagi-slot">{{ `找到 ${pageParams.total} 结果` }}</span>
			</el-pagination>
		</div>
		<EditViewSQLDialog ref="editViewSQLDialogRef" />
	</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import useListPageHook from "@/hooks/listPage";
import { getMySaveListApi } from "@/api/modules/mock/mock";
import { useRoute, useRouter } from "vue-router";
import EditViewSQLDialog from "./EditViewSQLDialog.vue";
import { useUserStoreSessionStorage } from "@/stores/user";
import { ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();
const userSessionStore = useUserStoreSessionStorage();
// 编辑基本信息弹窗
const editViewSQLDialogRef = ref<InstanceType<typeof EditViewSQLDialog> | null>(null);
const openeditViewSQLDialog = (behavior: any, info: any) => {
	userSessionStore.setBehavior(behavior);
	const params = {
		info: info,
	};
	editViewSQLDialogRef.value?.acceptParams(params);
};

// 删除
const deleteMySave = (row: any) => {
	ElMessageBox.confirm("此操作将删除保存的SQL语句,是否继续?", `提示`, {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		customClass: "delete-message",
		type: "warning",
	})
		.then(async () => {
			// try {
			//   await postCustomerCoDeletionApi({ id: row.id });
			//   ElMessage.success("删除成功");
			//   refreshData();
			// } catch (err) {
			//   console.error(err);
			// }
		})
		.catch(() => {
			ElMessage.info("取消删除");
		});
};

const queryFormRaw = {
	// name: "",
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
	getMySaveListApi, //temp test

	beanInfo,
	queryFormRaw
);

defineExpose({
	refreshData,
});

// onMounted(() => {
// 	refreshData();
// });
</script>

<style lang="scss" scoped>
.common-layout-system {
	.table-wrapper {
		display: flex;
		flex-direction: column;
		flex: 1;
		border-top: 1px solid #ebeef5;
		height: 0;
	}
}
</style>
