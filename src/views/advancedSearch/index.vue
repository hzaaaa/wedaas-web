<template>
	<div class="flex" style="height: 100%">
		<!-- <AdvancedSearchBar /> -->
		<fold-panel :width="224">
			<div class="search-form-wrapper" style="margin-top: 20px">
				<!-- <div class="mask" :style="{ width: isCollapse ? '100%' : '0' }"></div> -->
				<div class="component-title">
					<el-icon><Search /></el-icon>
					<span>高级搜索</span>
				</div>
				<el-input v-model="queryForm.term" size="large" placeholder="Please Input" prefix-icon="Search" />
				<div>
					<span class="sub-title">筛选条件</span>
				</div>
				<el-divider />
				<div class="filter-criteria">
					<span class="filter-title">数据源</span>
					<el-select
						v-model="dataSourceSelected"
						class="m-2"
						placeholder="Select"
						size="large"
						@change="handleDSSelectedChange"
						value-key="dsName"
						clearable
					>
						<el-option v-for="(item, index) in dataSourceNameListOptions" :key="index" :label="item.dsName" :value="item" />
					</el-select>
					<el-select
						v-model="queryForm.database_id"
						class="m-2"
						placeholder="Select"
						size="large"
						ref="databaseSelectorRef"
						clearable
					>
						<el-option v-for="(item, index) in databaseListOptions" :key="index" :label="item.c" :value="item.a" />
					</el-select>
					<el-divider border-style="dotted" />
					<span class="filter-title">数据目录</span>
					<el-select v-model="queryForm.catalog_root_id" class="m-2" placeholder="Select" size="large" clearable>
						<el-option v-for="(item, index) in dataCatalogListOptions" :key="index" :label="item.b" :value="item.a" />
					</el-select>
					<span class="filter-title">数据标签</span>
					<el-select v-model="queryForm.tags_id" class="m-2" placeholder="Select" size="large" multiple>
						<el-option v-for="(item, index) in dataLabelListOptions" :key="index" :label="item.b" :value="item.a" />
					</el-select>
				</div>
			</div>
		</fold-panel>
		<div class="common-layout-system">
			<div class="operat-buttons">
				<span>结果</span>
				<!-- <el-button type="warning" v-permission="['roleManage:add']" icon="Plus" @click="openOrgDrawer('新建')">新建</el-button> -->
				<!-- <div class="space"></div> -->
				<div>
					<el-icon @click="viewType = 'table'" :color="viewType == 'table' ? 'blue' : ''"><List /></el-icon>
					<el-icon @click="viewType = 'card'" :color="viewType == 'card' ? 'blue' : ''"><Grid /></el-icon>
					<el-popover placement="left-start" :visible="retrievalPopoverVisible" popper-class="retrieval-popover">
						<template #reference>
							<el-icon @click="retrievalPopoverVisible = true"><PieChart /></el-icon>
						</template>
						<div class="popover-header">
							<span>筛选结果分析</span><el-icon @click="retrievalPopoverVisible = false"><Close /></el-icon>
						</div>
						<div class="popover-content">
							<div>
								<el-progress
									type="circle"
									:percentage="totalCount != 0 ? Number(((tableDataList.length / totalCount) * 100).toFixed(2)) : 0.0"
									:stroke-width="14"
								></el-progress>
							</div>

							<div class="content-detail">
								<div>
									<span>检索命中率</span
									><span>{{ totalCount != 0 ? `${((tableDataList.length / totalCount) * 100).toFixed(2)}%` : "0%" }}</span>
								</div>
								<div>
									<span>总命中数</span><span>{{ tableDataList.length }}</span>
								</div>
								<div><span>数据表总数</span>{{ totalCount }}</div>
							</div>
						</div>
					</el-popover>
				</div>
			</div>

			<div class="table-wrapper" v-show="viewType == 'table'">
				<el-table
					v-loading="tableLoading"
					:data="currentShowTableDataList"
					cell-class-name="table-cell"
					header-cell-class-name="header-cell"
					class="common-table"
					:show-header="false"
					show-overflow-tooltip
				>
					<el-table-column label="表名&数据库">
						<template #default="scope">
							<div class="table-icon-text" @click="openTableDetailPage(scope.row.ti)">
								<el-icon color="blue"><Calendar /></el-icon><span>{{ scope.row.tn }}</span>
							</div>
							<div>
								<el-icon><Coin /></el-icon><span>{{ scope.row.sc }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="描述&数据源">
						<template #default="scope">
							<div>
								<span>描述:</span><span>{{ scope.row.td }}</span>
							</div>
							<div>
								<span>数据源:</span><span>{{ scope.row.ds }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="数据目录">
						<template #default="scope">
							<div>
								<el-icon color="blue"><Suitcase /></el-icon><span>{{ scope.row.ct }}</span>
							</div>
						</template>
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
							<div>
								<el-icon :color="scope.row.bf ? 'blue' : ''"><Star /></el-icon><span>关注</span>
							</div>
							<div>
								<el-icon><View /></el-icon><span>查看</span>
							</div>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<div class="cards-wrapper" v-show="viewType == 'card'">
				<el-scrollbar style="width: 100%; height: 100%">
					<el-card v-for="(item, index) in currentShowTableDataList" :key="index" class="result-card" shadow="hover">
						<template #header>
							<div class="card-header">
								<el-icon color="blue"><Calendar /></el-icon><span style="margin-left: 5px">{{ item.tn }}</span>
							</div>
						</template>
						<div class="card-info">
							<el-icon><Coin /></el-icon><span>{{ item.sc }}</span>
						</div>
						<div class="card-info">
							<span>数据源:</span><span>{{ item.ds }}</span>
						</div>
						<div class="card-info">
							<el-icon color="blue"><Suitcase /></el-icon><span>{{ item.ct }}</span>
						</div>
						<div class="card-info">
							<span>描述:</span><span class="info-desc">{{ item.td }}</span>
						</div>

						<div class="card-info footer">
							<div>
								<el-icon :color="item.bf ? 'blue' : ''"><Star /></el-icon><span>关注</span>
							</div>
							<div>
								<el-icon><View /></el-icon><span>查看</span>
							</div>
						</div>
					</el-card>
				</el-scrollbar>
			</div>

			<div class="pagination-block">
				<el-button type="primary" @click="check()">check</el-button>
				<el-pagination
					:total="tableDataList.length"
					:current-page="pagiParams.pageNum"
					:page-size="pagiParams.pageSize"
					@current-change="handleCurrentPageChange"
					layout="slot,->, prev, pager, next, jumper"
					background
				>
					<span class="pagi-slot">{{ `找到 ${tableDataList.length} 结果` }}</span>
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import useListPageHook from "@/hooks/listPage";
import {
	postDataSourceNameListApi,
	getDatabaseListApi,
	getCatalogListApi,
	getLabelListApi,
} from "@/api/modules/advancedSearch/searchFilter";
import { postAdvancedSearchListApi } from "@/api/modules/advancedSearch/advancedSearch";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const viewType = ref("table");
const retrievalPopoverVisible = ref(false);

const dataSourceSelected = ref("");
const dataSourceNameListOptions = ref<any>([]);

// 获取数据源列表

const getDataSourceNameListOptions = async () => {
	try {
		const { data } = await postDataSourceNameListApi();
		dataSourceNameListOptions.value = data;
	} catch (err) {
		console.error(err);
	}
};

const handleDSSelectedChange = (val: any) => {
	queryForm.value.database_id = "";
	if (val) {
		console.log(true);
		const databaseListParams = {
			dsName: val.dsName,
			metastoreType: val.metastoreType,
		};
		getDatabaseListOptions(databaseListParams);
	}
};

// const databaseSelected = ref("");
const databaseSelectorRef = ref();
const databaseListOptions = ref<any>([]);
// 获取数据库列表
const getDatabaseListOptions = async (params: any) => {
	try {
		const { data } = await getDatabaseListApi(params);
		databaseListOptions.value = data;
		databaseSelectorRef.value.toggleMenu();
	} catch (err) {
		console.error(err);
	}
};

// const dataCatalogSelected = ref("");
const dataCatalogListOptions = ref<any>([]);
// 获取数据目录列表
const getCatalogListOptions = async () => {
	try {
		const { data } = await getCatalogListApi();
		dataCatalogListOptions.value = data;
	} catch (err) {
		console.error(err);
	}
};

// const dataLabelSelected = ref("");
const dataLabelListOptions = ref<any>([]);
// 获取数据标签

const getLabelListOptions = async () => {
	try {
		const { data } = await getLabelListApi();
		dataLabelListOptions.value = data;
	} catch (err) {
		console.error(err);
	}
};
const queryForm = ref({
	// name: "",
	catalog_root_id: "",
	database_id: "",
	term: "",
	tags_id: "",
});

const tableDataList = ref<any>([]);
const currentShowTableDataList = computed(() => {
	return tableDataList.value.slice((pagiParams.pageNum - 1) * pagiParams.pageSize, pagiParams.pageNum * pagiParams.pageSize);
});

const totalCount = ref(0);

const tableLoading = ref(false);

const getAdvancedSearchList = async (params: any) => {
	try {
		tableLoading.value = true;
		let queryParams = { ...params };
		// if (queryParams.tags_id.length)
		queryParams.tags_id = queryParams.tags_id + "";
		const { data } = await postAdvancedSearchListApi(queryParams);
		tableDataList.value = data.data_list;
		totalCount.value = data.total_count;
		tableLoading.value = false;
	} catch (err) {
		console.error(err);
	}
};

// ** 分页参数
const pagiParams = reactive({
	pageNum: 1,
	pageSize: 20,
	total: 0,
});

const handleCurrentPageChange = (val: number) => {
	pagiParams.pageNum = val;
};

const openTableDetailPage = (tableId: any) => {
	router.push({
		name: "tableDetail",
		// state: {
		// 	// params: { ...employeeRow.value },
		// },
		query: {
			tableId: tableId,
		},
	});
};

const check = () => {
	console.log(queryForm.value);
};

// const queryFormRaw = {
// 	// name: "",
// 	catalog_root_id: "",
// 	database_id: "",
// 	term: "",
// 	tags_id: "",
// };

// const beanInfo = {};

// let {
// 	tableLoading,
// 	pageParams,
// 	tableDataList,
// 	handleCurrentPageChange,
// 	handleSizeChange,
// 	resetPageToOne,
// 	refreshData, //刷新按钮

// 	drawer,
// 	employeeRow,
// 	onAddDrawer,
// 	onEditDrawer,
// 	searchByQueryForm,
// 	subData,

// 	queryForm,
// 	doReset,
// } = useListPageHook(
// 	// getCompanyListApi,
// 	postAdvancedSearchListApi, //temp test

// 	beanInfo,
// 	queryFormRaw
// );
watch(
	() => queryForm.value,
	(newVal: any) => {
		console.log(newVal);
		if (newVal.catalog_root_id || newVal.database_id.length || newVal.tags_id.length) {
			getAdvancedSearchList(queryForm.value);
		} else {
			// console.log("条件清空");
			tableDataList.value = [];
		}
	},
	{
		immediate: true,
		deep: true,
	}
);

onMounted(() => {
	getDataSourceNameListOptions();
	getCatalogListOptions();
	getLabelListOptions();
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>
