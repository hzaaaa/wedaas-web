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
				<el-input v-model="input1" size="large" placeholder="Please Input" prefix-icon="Search" />
				<div>
					<span class="sub-title">筛选条件</span>
				</div>
				<el-divider />
				<div class="filter-criteria">
					<span class="filter-title">数据源</span>
					<el-select v-model="value" class="m-2" placeholder="Select" size="large">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
					<el-select v-model="value" class="m-2" placeholder="Select" size="large">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
					<el-divider border-style="dotted" />
					<span class="filter-title">数据目录</span>
					<el-select v-model="value" class="m-2" placeholder="Select" size="large">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
					</el-select>
					<span class="filter-title">数据标签</span>
					<el-select v-model="value" class="m-2" placeholder="Select" size="large">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
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
							<div><el-progress type="circle" :percentage="9.12" :stroke-width="14"></el-progress></div>

							<div class="content-detail">
								<div><span>检索命中率</span><span>9.12%</span></div>
								<div><span>总命中数</span><span>9</span></div>
								<div><span>数据表总数</span>98</div>
							</div>
						</div>
					</el-popover>
				</div>
			</div>

			<div class="table-wrapper" v-show="viewType == 'table'">
				<el-table
					v-loading="tableLoading"
					:data="tableDataList"
					cell-class-name="table-cell"
					header-cell-class-name="header-cell"
					class="common-table"
					:show-header="false"
					show-overflow-tooltip
				>
					<el-table-column label="表名&数据库">
						<template #default="scope">
							<div class="table-icon-text" @click="openTableDetailPage">
								<el-icon color="blue"><Calendar /></el-icon><span>{{ scope.row.tableName }}</span>
							</div>
							<div>
								<el-icon><Coin /></el-icon><span>{{ scope.row.dataBaseName }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="描述&数据源">
						<template #default="scope">
							<div>
								<span>描述:</span><span>{{ scope.row.desc }}</span>
							</div>
							<div>
								<span>数据源:</span><span>{{ scope.row.dataSourceName }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="数据目录">
						<template #default="scope">
							<div>
								<el-icon color="blue"><Suitcase /></el-icon><span>{{ scope.row.dataCatalog }}</span>
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
								<el-icon :color="scope.row.follow ? 'blue' : ''"><Star /></el-icon><span>关注</span>
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
					<el-card v-for="item in tableDataList" :key="item.id" class="result-card" shadow="hover">
						<template #header>
							<div class="card-header">
								<el-icon color="blue"><Calendar /></el-icon><span style="margin-left: 5px">{{ item.tableName }}</span>
							</div>
						</template>
						<div class="card-info">
							<el-icon><Coin /></el-icon><span>{{ item.dataBaseName }}</span>
						</div>
						<div class="card-info">
							<span>数据源:</span><span>{{ item.dataSourceName }}</span>
						</div>
						<div class="card-info">
							<el-icon color="blue"><Suitcase /></el-icon><span>{{ item.dataCatalog }}</span>
						</div>
						<div class="card-info">
							<span>描述:</span><span class="info-desc">{{ item.desc }}</span>
						</div>

						<div class="card-info footer">
							<div>
								<el-icon :color="item.follow ? 'blue' : ''"><Star /></el-icon><span>关注</span>
							</div>
							<div>
								<el-icon><View /></el-icon><span>查看</span>
							</div>
						</div>
					</el-card>
				</el-scrollbar>
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
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useListPageHook from "@/hooks/listPage";
import { getAdvancedSearchListApi } from "@/api/modules/mock/mock";
import AdvancedSearchBar from "./components/advancedSearchBar.vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const viewType = ref("table");
const retrievalPopoverVisible = ref(false);
const input1 = ref("");

const value = ref("");

const options = [
	{
		value: "Option1",
		label: "Option1",
	},
	{
		value: "Option2",
		label: "Option2",
	},
	{
		value: "Option3",
		label: "Option3",
	},
	{
		value: "Option4",
		label: "Option4",
	},
	{
		value: "Option5",
		label: "Option5",
	},
];

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
</script>

<style lang="scss" scoped>
@import "./index";
</style>
