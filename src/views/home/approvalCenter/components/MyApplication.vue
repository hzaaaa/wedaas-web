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
				<el-table-column
					label="申请人"
					prop="tableName"
					:filters="applicantFilterArr"
					:filter-method="handleFiltersChange"
					filter-placement="bottom-end"
				/>
				<el-table-column
					label="分类"
					prop="dataBaseName"
					:filters="[
						{ text: '表权限', value: '' },
						{ text: 'API权限', value: '' },
					]"
					filter-placement="bottom-end"
				>
				</el-table-column>
				<el-table-column label="申请时间" prop="dataCatalog" :filters="[]" filter-placement="bottom-end" />
				<el-table-column label="申请内容" prop="dataCatalog">
					<template #default="scope">
						<div class="api-app-content" v-if="scope.row.follow">
							<div class="app-content-detail">
								<el-icon color="blue"><Document /></el-icon><span>{{ scope.row.desc }}</span>
							</div>
							<div class="app-content-detail">
								<span>创建人：{{ scope.row.desc }}</span>
							</div>
							<div class="app-content-detail">
								<span>发布状态：{{ scope.row.dataCatalog }}</span>
							</div>
						</div>
						<div class="table-app-content" v-else>
							<div class="app-content-detail">
								<span>数据源</span><span> : </span><span> {{ scope.row.desc }}</span>
							</div>
							<div class="app-content-detail">
								<span>数据库</span><span> : </span><span>{{ scope.row.desc }}</span>
							</div>
							<div class="app-content-detail">
								<span>表名</span><span> : </span> <span class="table-name">{{ scope.row.dataCatalog }}</span>
							</div>
							<div class="app-content-detail">
								<span>权限</span><span> : </span> <span>{{ scope.row.dataCatalog }}</span>
							</div>
						</div>
					</template></el-table-column
				>
				<el-table-column label="申请原因" prop="dataCatalog" />
				<el-table-column
					label="审批状态"
					prop="dataCatalog"
					:filters="[
						{ text: '待审批', value: '' },
						{ text: '无需审批', value: '' },
						{ text: '已批准', value: '' },
						{ text: '已驳回', value: '' },
					]"
					filter-placement="bottom-end"
				/>
				<el-table-column label="操作时间" prop="dataCatalog" />
				<el-table-column label="操作" fixed="right" width="200px">
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
						<el-button type="primary" link>批准</el-button>
						<el-button type="primary" link>驳回</el-button>
						<el-button type="primary" link>撤销</el-button>
						<el-button type="primary" link @click="openEditBasicInfoDialog(scope.row)">查看</el-button>
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
		<AppLogViewDialog ref="appLogViewDialogRef" />
	</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import useListPageHook from "@/hooks/listPage";
import { getAdvancedSearchListApi } from "@/api/modules/mock/mock";
import { useRoute, useRouter } from "vue-router";
import AppLogViewDialog from "./AppLogViewDialog.vue";

const router = useRouter();
// 编辑基本信息弹窗
const appLogViewDialogRef = ref<InstanceType<typeof AppLogViewDialog> | null>(null);
const openEditBasicInfoDialog = (info: any) => {
	const params = {
		info: info,
	};
	appLogViewDialogRef.value?.acceptParams(params);
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

const applicantFilterArr = computed(() => {
	console.log(Array.from(tableDataList));
	return Array.from(new Set(tableDataList.value)).map((item: any) => ({
		text: item.tableName,
		value: item.tableName,
	}));
});

const handleFiltersChange = (value: any, row: any, column: any) => {
	console.log(value, row, column);
	return value == row.tableName;
};

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
	padding: 0;
	.table-wrapper {
		display: flex;

		// overflow-y: auto;
		flex-direction: column;
		flex: 1;
		border-top: 1px solid #ebeef5;
		height: 0;
		.app-content-detail {
			span {
				&:first-of-type {
					display: inline-block;
					width: 40px;
				}
			}
			span.table-name {
				color: var(--el-color-primary);
			}
		}
	}
}
</style>
