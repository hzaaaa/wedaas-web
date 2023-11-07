<template>
	<div class="card per-group-card">
		<el-tabs v-model="activeName" @tab-click="handleTabClick" tab-position="left">
			<!-- <el-tab-pane label="基本信息" name="basicInfo"> </el-tab-pane>
			<el-tab-pane label="人员配置" name="personnelConfig"> </el-tab-pane>
			<el-tab-pane label="数据配置" name="dataConfig"> </el-tab-pane>
			<el-tab-pane label="API配置" name="APIConfig"> </el-tab-pane> -->
			<el-tab-pane v-for="item in perGroupTabs" :key="item.name" :label="item.title" :name="item.name">
				<component :is="item.content" :submitForm="form">
					<template #operate-btn>
						<div class="operate-btn">
							<el-button type="">取消</el-button> <el-button type="primary" @click="check">确定</el-button>
						</div>
					</template>
				</component>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { FormInstance, FormRules, TabsPaneContext } from "element-plus";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import BasicInfo from "./components/BasicInfo.vue";
import PersonnelConfig from "./components/PersonnelConfig.vue";
import DataConfig from "./components/DataConfig.vue";
import APIConfig from "./components/APIConfig.vue";

const userStore = useUserStore();
const activeName = ref("BasicInfo");

const perGroupTabs = [
	{ title: "基本信息", name: "BasicInfo", content: BasicInfo },
	{ title: "人员配置", name: "PersonnelConfig", content: PersonnelConfig },
	{ title: "数据配置", name: "DataConfig", content: DataConfig },
	{ title: "API配置", name: "APIConfig", content: APIConfig },
];

const handleTabClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event);
	// if (tab.paneName == "myApplication")
};

const form = ref<any>({});
// const componentRef = ref<InstanceType<typeof BasicInfo> | InstanceType<typeof PersonnelConfig> | null>(null);
const check = () => {
	// console.log(componentRef.value?.submitForm);
	console.log(form.value);
};

// onMounted(() => {
// 	myApplicationRef.value?.searchByQueryForm();
// });
</script>

<style lang="scss" scoped>
@import "./index";
</style>
