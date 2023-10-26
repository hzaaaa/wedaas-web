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
				<el-table-column label="名称" width="120">
					<template #default="scope">{{ scope.row.date }}</template>
				</el-table-column>
				<el-table-column property="name" label="描述" width="120" />
				<el-table-column property="address" label="创建时间" show-overflow-tooltip />
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
	// list = listDataJson.data.list;
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
// tableData = [...tableData, ...tableData];
// tableData = [...tableData, ...tableData];
// tableData = [...tableData, ...tableData];
const inputInfo = ref({
	name: "",
});
const rulesForm = reactive<any>({
	name: [{ required: true, message: "请输入主目录名称!", trigger: "blur" }],
});

const dialogVisible = ref(false);

const dialogProps = ref<any>({
	row: {
		status: 0,
	},
});

const acceptParams = (params: any) => {
	dialogProps.value = params;
	dialogVisible.value = true;
};

const inputInfoRef = <any>ref(null);
// 提交
const submit = async () => {
	let formEl = <FormInstance | undefined>inputInfoRef.value;
	if (!formEl) return;
	formEl.validate(async (valid, fields) => {
		if (valid) {
		} else {
			console.log("error", fields);
		}
	});
	// dialogVisible.value = false;
	// emit("refreshData");
};
const getLabelInfo = () => {};

const emit = defineEmits(["refreshData"]);

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped></style>
