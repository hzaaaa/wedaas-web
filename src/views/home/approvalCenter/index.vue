<template>
	<div class="card approval-center-card">
		<div class="approval-center-list-operator">
			<el-checkbox v-model="checked1" label="已驳回" @change="check"></el-checkbox
			><el-dropdown>
				<span class="el-dropdown-link">
					<span>{{ filterTypeDropDownText }}</span>
					<el-icon class="el-icon--right">
						<arrow-down />
					</el-icon>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="filterTypeDropDownText = '筛选类型'">全部</el-dropdown-item>
						<el-dropdown-item @click="filterTypeDropDownText = '表权限'">表权限</el-dropdown-item>
						<el-dropdown-item @click="filterTypeDropDownText = ' API权限'">API权限</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
			<el-dropdown>
				<span class="el-dropdown-link">
					<span>{{ filterApprovalTimeDropDownText }}</span>
					<el-icon class="el-icon--right">
						<arrow-down />
					</el-icon>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click="filterApprovalTimeDropDownText = '申请时间'">全部</el-dropdown-item>
						<el-dropdown-item @click="filterApprovalTimeDropDownText = '最近一天'">最近一天</el-dropdown-item>
						<el-dropdown-item @click="filterApprovalTimeDropDownText = '最近一周'">最近一周</el-dropdown-item>
						<el-dropdown-item @click="filterApprovalTimeDropDownText = '最近一月'">最近一月</el-dropdown-item>
						<el-dropdown-item @click="filterApprovalTimeDropDownText = '最近一年'">最近一年</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
			<Transition
				><el-dropdown v-if="activeName == 'myApproval'">
					<span class="el-dropdown-link">
						<span>筛选申请人</span>
						<el-icon class="el-icon--right">
							<arrow-down />
						</el-icon>
					</span>
					<template #dropdown>
						<!-- <el-dropdown-menu>
						<el-dropdown-item @click="filterApprovalTimeDropDownText = '申请时间'">全部</el-dropdown-item>
						<el-dropdown-item @click="filterApprovalTimeDropDownText = '最近一天'">最近一天</el-dropdown-item>
						<el-dropdown-item @click="filterApprovalTimeDropDownText = '最近一周'">最近一周</el-dropdown-item>
						<el-dropdown-item @click="filterApprovalTimeDropDownText = '最近一月'">最近一月</el-dropdown-item>
						<el-dropdown-item @click="filterApprovalTimeDropDownText = '最近一年'">最近一年</el-dropdown-item>
					</el-dropdown-menu> -->
					</template>
				</el-dropdown></Transition
			>

			<el-input v-model="input1" class="" size="small" placeholder="Please Input" suffix-icon="Search" />
		</div>
		<el-tabs v-model="activeName" @tab-click="handleTabClick">
			<el-tab-pane label="我的申请" name="myApplication">
				<MyApplication ref="myApplicationRef" />
			</el-tab-pane>
			<el-tab-pane label="我的审批" name="myApproval">
				<MyApproval ref="myApprovalRef" />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { FormInstance, FormRules, TabsPaneContext } from "element-plus";
import { useUserStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import MyApplication from "./components/MyApplication.vue";
import MyApproval from "./components/MyApproval.vue";

const userStore = useUserStore();
const activeName = ref("myApplication");
const checked1 = ref(true);
const filterTypeDropDownText = ref("筛选类型");
const filterApprovalTimeDropDownText = ref("申请时间");
const input1 = ref("");

const myApplicationRef = ref<InstanceType<typeof MyApplication> | null>(null);

const myApprovalRef = ref<InstanceType<typeof MyApproval> | null>(null);
const handleTabClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event);
	// if (tab.paneName == "myApplication")
};

const check = () => {
	console.log(userStore.userInfoGet);
	console.log(userStore.username);
};

// onMounted(() => {
// 	myApplicationRef.value?.searchByQueryForm();
// });
</script>

<style lang="scss" scoped>
@import "./index";
</style>
