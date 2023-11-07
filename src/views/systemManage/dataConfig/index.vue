<template>
	<div class="card authority-manage-card">
		<!-- <div class="authority-manage-list-operator">
			<span>群组搜索</span><el-input v-model="input1" class="" size="small" placeholder="Please Input" suffix-icon="Search" />
			<el-button type="warning" icon="Plus">新增群组</el-button>
		</div> -->
		<el-tabs v-model="activeName" @tab-click="handleTabClick" :before-leave="beforeTabsLeave">
			<el-tab-pane label="关系库" name="relational-database">
				<RelationDatabaseList ref="relationalDatabaseRef" />
			</el-tab-pane>
			<el-tab-pane label="Hadoop" name="data-warehouse">
				<DataWarehouseList ref="dataWarehouseListRef" />
			</el-tab-pane>
			<el-tab-pane name="operator-group"
				><template #label>
					<!-- <div class="authority-manage-list-operator"> -->
					<el-button type="warning" icon="Plus" @click="openAddEditDataSourceDialog('add')">新增数据源</el-button>
					<!-- </div> -->
				</template></el-tab-pane
			>
		</el-tabs>
	</div>
	<AddEditDataSourceDialog ref="addEditDataSourceDialogRef" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { FormInstance, FormRules, TabsPaneContext } from "element-plus";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
// import FormalPerGroup from "./components/FormalPerGroup.vue";
// import VirtualPerGroup from "./components/VirtualPerGroup.vue";
import RelationDatabaseList from "./components/RelationalDatabaseList.vue";
import DataWarehouseList from "./components/DataWarehouseList.vue";
import AddEditDataSourceDialog from "./components/AddEditDataSourceDialog.vue";
import { useUserStoreSessionStorage } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const userSessionStore = useUserStoreSessionStorage();
const activeName = ref("relational-database");

const input1 = ref("");

const relationalDatabaseRef = ref<InstanceType<typeof RelationDatabaseList> | null>(null);

const dataWarehouseListRef = ref<InstanceType<typeof DataWarehouseList> | null>(null);
const handleTabClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event);
	// if (tab.paneName == "FormalPerGroup")
};

const beforeTabsLeave = (activeName: any, oldActiveName: any) => {
	// console.log(activeName, oldActiveName);
	if (activeName == "operator-group") return false;
};

// 编辑基本信息弹窗
const addEditDataSourceDialogRef = ref<InstanceType<typeof AddEditDataSourceDialog> | null>(null);
const openAddEditDataSourceDialog = (info: any) => {
	const params = {
		info: info,
	};
	addEditDataSourceDialogRef.value?.acceptParams(params);
};

// onMounted(() => {
// 	relationalDatabaseRef.value?.searchByQueryForm();
// });
</script>

<style lang="scss" scoped>
@import "./index";
</style>
