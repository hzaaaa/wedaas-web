<template>
	<div class="flex" style="height: 100%">
		<!-- <AdvancedSearchBar /> -->
		<fold-panel :width="224">
			<div class="search-form-wrapper" style="margin-top: 20px">
				<div style="display: flex; justify-content: space-between">
					<span class="sub-title">基本信息</span>
					<div @click="openEditBasicInfoDialog(basicInfo)">
						<el-icon color="blue"><EditPen /></el-icon><span>编辑</span>
					</div>
				</div>
				<el-divider />
				<div class="filter-criteria">
					<div class="table-detail-info">
						<span>表名:</span><span>ods_cfx_admin_full</span
						><el-icon v-if="!tableFollow" @click="tableFollow = true"><Star /></el-icon
						><el-icon @click="tableFollow = false" v-else><StarFilled /></el-icon>
					</div>
					<div class="table-detail-info"><span>数据源:</span><span>CHDHIVE元数据</span></div>
					<div class="table-detail-info"><span>数据库:</span><span>cfx_dingsun</span></div>
					<div class="table-detail-info"><span>表名:</span><span>ods_cfx_admin_full</span></div>
					<div class="table-detail-info"><span>数据源:</span><span>CHDHIVE元数据</span></div>
					<div class="table-detail-info"><span>数据库:</span><span>cfx_dingsun</span></div>
					<div class="table-detail-info"><span>总行数:</span><span>0</span></div>
					<div class="table-detail-info"><span>字段数:</span><span>7</span></div>
					<div class="table-detail-info"><span>描述:</span><span>渠道公司主体表</span></div>
					<div class="table-detail-info"><span>目录:</span><span>暂无</span></div>
					<div class="table-detail-info"><span>业务主体部门:</span><span>暂无</span></div>
					<div class="table-detail-info"><span>业务定义:</span><span>暂无</span></div>
					<div class="table-detail-info"><span>IT负责人:</span><span>暂无</span></div>
					<div class="table-detail-info"><span>备注:</span><span>暂无</span></div>
					<div class="table-detail-info"><span>标签:</span><span>暂无</span></div>
					<div class="table-detail-info"><span>已关注的用户:</span><span>暂无</span></div>
				</div>
			</div>
		</fold-panel>
		<div class="tab-block-wrapper">
			<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="表信息" name="first">User</el-tab-pane>
				<el-tab-pane label="数据样本" name="second">Config</el-tab-pane>
				<el-tab-pane label="数据探查" name="third">Role</el-tab-pane>
			</el-tabs>
		</div>
		<BasicInfoEditDialog ref="editBasicInfoDialogRef" />
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useListPageHook from "@/hooks/listPage";
import { getAdvancedSearchListApi } from "@/api/modules/mock/mock";
import BasicInfoEditDialog from "./components/BasicInfoEditDialog.vue";
import { useRoute, useRouter } from "vue-router";
import type { TabsPaneContext } from "element-plus";
const tableFollow = ref(false);
const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event);
};

const router = useRouter();
const basicInfo = ref("");
// 编辑基本信息弹窗
const editBasicInfoDialogRef = ref<InstanceType<typeof BasicInfoEditDialog> | null>(null);
const openEditBasicInfoDialog = (info: any) => {
	const params = {
		info: info,
	};
	editBasicInfoDialogRef.value?.acceptParams(params);
};
const queryFormRaw = {
	// name: "",
};

const beanInfo = {};

let {
	tableLoading,
	// tableMaxHeight,
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
