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
				<el-table-column label="表名" prop="tableName">
					<template #default="scope">
						<div @click="openTableDetailPage">
							<span>{{ scope.row.tableName }}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="数据库" prop="dataBaseName">
					<!-- <template #default="scope">
						<div>
							<span>描述:</span><span>{{ scope.row.desc }}</span>
						</div>
						<div>
							<span>数据源:</span><span>{{ scope.row.dataSourceName }}</span>
						</div>
					</template> -->
				</el-table-column>
				<el-table-column label="目录" prop="dataCatalog">
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
						<div>
							<el-icon><View /></el-icon>
						</div>
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
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from "vue";
import useListPageHook from "@/hooks/listPage";
import { getAdvancedSearchListApi } from "@/api/modules/mock/mock";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const openTableDetailPage = () => {
	router.push({
		name: "tableDetail",
		// state: {
		// 	// params: { ...employeeRow.value },
		// },
		// query: {
		// 	id: row?.id,
		// },
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
	getAdvancedSearchListApi, //temp test

	beanInfo,
	queryFormRaw
);

defineExpose({
	refreshData,
	searchByQueryForm,
});

// onMounted(() => {
// 	searchByQueryForm();
// });
</script>

<style lang="scss" scoped>
.common-layout-system {
	.table-wrapper {
		display: flex;

		// overflow-y: auto;
		flex-direction: column;
		flex: 1;
		border-top: 1px solid #ebeef5;
		height: 0;

		// .common-table.el-table {
		// 	tbody {
		// 		tr {
		// 			.table-cell {
		// 				.cell {
		// 					display: flex;
		// 					flex-direction: column;
		// 					align-items: center;
		// 					div {
		// 						display: flex;
		// 						align-items: center;
		// 						&:first-of-type {
		// 							margin-bottom: 5px;
		// 						}
		// 					}
		// 					span {
		// 						margin-left: 4px;
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// }
	}
}
</style>
