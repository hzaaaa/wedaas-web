<template>
	<div class="card authority-manage-card">
		<!-- <div class="authority-manage-list-operator">
			<span>群组搜索</span><el-input v-model="input1" class="" size="small" placeholder="Please Input" suffix-icon="Search" />
			<el-button type="warning" icon="Plus">新增群组</el-button>
		</div> -->
		<el-tabs v-model="activeName" @tab-click="handleTabClick" :before-leave="beforeTabsLeave">
			<el-tab-pane label="普通权限组" name="formal-permisson">
				<FormalPerGroup ref="formalPerGroupRef" />
			</el-tab-pane>
			<el-tab-pane label="虚拟权限组" name="virtual-permisson">
				<VirtualPerGroup ref="virtualPerGroupRef" />
			</el-tab-pane>
			<el-tab-pane name="operator-group"
				><template #label>
					<!-- <div class="authority-manage-list-operator"> -->
					<span>群组搜索</span><el-input v-model="input1" class="" size="small" placeholder="Please Input" suffix-icon="Search" />
					<el-button type="warning" icon="Plus" @click="openAddEditPerGroupPage('add')">新增群组</el-button>
					<!-- </div> -->
				</template></el-tab-pane
			>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { FormInstance, FormRules, TabsPaneContext } from "element-plus";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import FormalPerGroup from "./components/FormalPerGroup.vue";
import VirtualPerGroup from "./components/VirtualPerGroup.vue";
import { useUserStoreSessionStorage } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const userSessionStore = useUserStoreSessionStorage();
const activeName = ref("formal-permisson");

const input1 = ref("");

const formalPerGroupRef = ref<InstanceType<typeof FormalPerGroup> | null>(null);

const virtualPerGroupRef = ref<InstanceType<typeof VirtualPerGroup> | null>(null);
const handleTabClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event);
	// if (tab.paneName == "FormalPerGroup")
};

const beforeTabsLeave = (activeName: any, oldActiveName: any) => {
	// console.log(activeName, oldActiveName);
	if (activeName == "operator-group") return false;
};

const openAddEditPerGroupPage = (behavior: string, row?: any) => {
	userSessionStore.setBehavior(behavior);
	router.push({
		name: "perGroupAddEdit",
		query: {
			id: row?.id,
		},
	});
};

// onMounted(() => {
// 	formalPerGroupRef.value?.searchByQueryForm();
// });
</script>

<style lang="scss" scoped>
@import "./index";
</style>
