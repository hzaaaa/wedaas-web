<template>
	<div class="flex" style="height: 100%">
		<AdvancedSearchBar />
		<div class="tab-block-wrapper">
			<el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
				<el-tab-pane label="表信息" name="first">User</el-tab-pane>
				<el-tab-pane label="数据样本" name="second">Config</el-tab-pane>
				<el-tab-pane label="数据探查" name="third">Role</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useListPageHook from "@/hooks/listPage";
import { getAdvancedSearchListApi } from "@/api/modules/mock/mock";
import AdvancedSearchBar from "./components/advancedSearchBar.vue";
import { useRoute, useRouter } from "vue-router";
import type { TabsPaneContext } from "element-plus";

const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event);
};

const router = useRouter();

const queryFormRaw = {
	// name: "",
};

const beanInfo = {};

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
	getAdvancedSearchListApi, //temp test

	beanInfo,
	queryFormRaw
);
</script>

<style lang="scss" scoped>
@import "./index";
</style>
