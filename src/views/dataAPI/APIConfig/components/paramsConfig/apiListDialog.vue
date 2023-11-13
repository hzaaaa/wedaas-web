<template>
	<div class="">
		<el-dialog v-model="dialogVisible" title="API名称" @open="getLabelInfo" width="1000" class="common-dialog">
			<el-table
				ref="multipleTableRef"
				:data="tableDataList"
				style="width: 100%; min-height: 350px; height: 400px; max-height: 400px"
				class="common-table"
				border
			>
				<el-table-column type="index" width="55" label=" " />
				<el-table-column label="名称">
					<template #default="scope">{{ scope.row.name }}</template>
				</el-table-column>
				<el-table-column prop="description" label="描述" />
				<el-table-column prop="create_time" label="创建时间" show-overflow-tooltip>
					<template #default="scope">{{ moment(scope.row.create_time * 1000).format("YYYY-MM-DD") }}</template>
				</el-table-column>
			</el-table>
			<div class="pagination-block mt30" style="display: flex; justify-content: flex-end">
				<el-pagination
					:page-sizes="pageParams.pageSizesList"
					background
					layout="total,sizes,prev, pager, next,jumper"
					@size-change="handleSizeChange"
					@current-change="handleCurrentPageChange"
					:current-page="pageParams.pageNum"
					:page-size="pageParams.pageSize"
					:total="pageParams.total"
				/></div
		></el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useListPageHook from "@/hooks/listPage";
import { ElMessage, type FormInstance, type FormRules, type TabsPaneContext } from "element-plus";
import { queryApiLisByDatasourceApi } from "@/api/modules/sqlQuery/index";
import moment from "moment";
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
	queryApiLisByDatasourceApi,

	beanInfo,
	queryFormRaw,
	(obj: any) => {
		let target = { ...obj, ...dialogProps.value.row };

		return target;
	}
);

const dialogVisible = ref(false);

const dialogProps = ref<any>({
	row: {},
});

const acceptParams = (params: any) => {
	dialogProps.value = params;
	dialogVisible.value = true;
	searchByQueryForm();
};

const getLabelInfo = () => {};

const emit = defineEmits(["refreshData"]);

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped></style>
