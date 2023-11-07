<template>
	<div class="flex" style="height: 100%">
		<!-- <AdvancedSearchBar /> -->
		<fold-panel :width="224">
			<div class="search-form-wrapper" style="margin-top: 20px">
				<div style="display: flex; justify-content: space-between">
					<span class="sub-title">基本信息</span>
					<div @click="openEditBasicInfoDialog(tableBasicInfo)">
						<el-icon color="blue"><EditPen /></el-icon><span>编辑</span>
					</div>
				</div>
				<el-divider />
				<div class="filter-criteria">
					<div class="table-detail-info">
						<span>表名:</span><span>{{ tableBasicInfo.tableName }}</span
						><el-icon v-if="!tableFollowed" @click="addFavorite()"><Star /></el-icon
						><el-icon @click="delFavorite()" v-else><StarFilled /></el-icon>
					</div>
					<div class="table-detail-info">
						<span>数据源:</span><span>{{ tableBasicInfo.datasourceName }}</span>
					</div>
					<div class="table-detail-info">
						<span>数据库:</span><span>{{ tableBasicInfo.databaseName }}</span>
					</div>
					<div class="table-detail-info">
						<span>总行数:</span><span>{{ tableBasicInfo.rowNum ? tableBasicInfo.rowNum : "0" }}</span>
					</div>
					<div class="table-detail-info">
						<span>字段数:</span><span>{{ tableBasicInfo.colInfo ? tableBasicInfo.colInfo.length : 0 }}</span>
					</div>
					<div class="table-detail-info">
						<span>描述:</span><span>{{ tableBasicInfo.tableDesp ? tableBasicInfo.tableDesp : "暂无" }}</span>
					</div>
					<div class="table-detail-info">
						<span>目录:</span><span>{{ tableBasicInfo.catalog }}</span>
					</div>
					<div class="table-detail-info">
						<span>业务主体部门:</span
						><span>{{ tableBasicInfo.businessDepartment ? tableBasicInfo.businessDepartment : "暂无" }}</span>
					</div>
					<div class="table-detail-info">
						<span>业务定义:</span><span>{{ tableBasicInfo.businessDefine ? tableBasicInfo.businessDefine : "暂无" }}</span>
					</div>
					<div class="table-detail-info">
						<span>IT负责人:</span
						><span>{{ tableBasicInfo.businessDepartment ? tableBasicInfo.businessDepartment : "暂无" }}</span>
					</div>
					<div class="table-detail-info">
						<span>备注:</span><span>{{ tableBasicInfo.businessDepartment ? tableBasicInfo.businessDepartment : "暂无" }}</span>
					</div>
					<div class="table-detail-info"><span>标签:</span></div>
					<div class="tags-wrapper">
						<el-tag type="info" v-for="(item, index) in tableBasicInfo.lables" :key="index">{{ item }}</el-tag>
					</div>

					<div class="table-detail-info follow-item">
						<span>已关注的用户:</span>
						<div class="follow-wrapper">
							<el-tooltip v-for="(item, index) in tableBasicInfo.favUsers" :key="index" placement="bottom">
								<template #content>{{ item.username }}<br />{{ item.email }}</template>
								<div class="tooltip-content">
									<SvgIcon name="icon-star" size="18px"></SvgIcon><span>{{ item.username.charAt(0) }}</span>
								</div>
							</el-tooltip>
						</div>
					</div>
					<div class="table-permission-application-icon" v-if="tableBasicInfo.permission != 2">
						<el-button type="primary" @click="openTablePerAppDialog(tableBasicInfo)">申请表权限</el-button>
					</div>
				</div>
			</div>
		</fold-panel>
		<div class="tab-block-wrapper">
			<el-tabs v-model="activeName" class="full-content-tabs" @tab-click="handleClick">
				<el-tab-pane label="表信息" name="first">
					<tableInfo></tableInfo>
				</el-tab-pane>
				<el-tab-pane label="数据样本" name="second">
					<dataSample></dataSample>
				</el-tab-pane>
				<el-tab-pane label="数据探查" name="third">
					<dataExploration></dataExploration>
				</el-tab-pane>
			</el-tabs>
		</div>
		<BasicInfoEditDialog ref="editBasicInfoDialogRef" @updateInfo="getTableInfo" />
		<TablePerAppDialog ref="tablePerAppDialogRef" />
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useListPageHook from "@/hooks/listPage";
import { postTableInfoApi } from "@/api/modules/tableInfo/tableInfo";
import { getUserFavorInfoListApi, postFavoriteAdditionApi, postFavoriteDeletionApi } from "@/api/modules/user/user";
import BasicInfoEditDialog from "./components/BasicInfoEditDialog.vue";
import tableInfo from "./components/tableInfo.vue";
import dataSample from "./components/dataSample.vue";
import dataExploration from "./components/dataExploration.vue";
import TablePerAppDialog from "@/components/TableAPIPerAppDialog/index.vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import type { TabsPaneContext } from "element-plus";
const tableFollow = ref(false);
const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
	console.log(tab, event);
};

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const routeParams = route.query;
const tableBasicInfo = ref<any>({});

// 获取table信息
const getTableInfo = async () => {
	try {
		const params = { tableId: routeParams.tableId!.toString() };
		const { data } = await postTableInfoApi(params);
		tableBasicInfo.value = data;
	} catch (err) {
		console.error(err);
	}
};

const userFavorList = ref<any>([]);

const tableFollowed = ref(false);

const getUserFavorList = async (params: any) => {
	try {
		const { data } = await getUserFavorInfoListApi(params);
		userFavorList.value = data;
		tableFollowed.value = userFavorList.value.some(
			(item: any) => item.tableId == tableBasicInfo.value.tableId && item.tableName == tableBasicInfo.value.tableName
		);
		console.log("tableFollowed.value: ", tableFollowed.value);
	} catch (err) {
		console.error(err);
	}
};

// 添加关注
const addFavorite = async () => {
	const params = {
		tableid: tableBasicInfo.value.tableId,
		tablename: tableBasicInfo.value.tableName,
		userid: userStore.userInfoGet.id.toString(),
		username: userStore.userInfoGet.username,
	};
	try {
		await postFavoriteAdditionApi(params);
		tableFollowed.value = true;
		operateFavUser({ username: userStore.userInfoGet.username, email: userStore.userInfoGet.email });
	} catch (err) {
		console.error(err);
	}
};

const delFavorite = async () => {
	const params = {
		tableId: tableBasicInfo.value.tableId,
		userId: userStore.userInfoGet.id.toString(),
	};
	try {
		await postFavoriteDeletionApi(params);
		tableFollowed.value = false;
		operateFavUser();
	} catch (err) {
		console.error(err);
	}
};

const operateFavUser = (userInfo?: any) => {
	if (userInfo) {
		tableBasicInfo.value.favUsers.push(userInfo);
	} else {
		const index = tableBasicInfo.value.favUsers.findIndex(
			(item: any) => item.username == userStore.userInfoGet.username && item.email == userStore.userInfoGet.email
		);
		if (index != -1) {
			tableBasicInfo.value.favUsers.splice(index, 1);
		}
	}
};

// 编辑基本信息弹窗
const editBasicInfoDialogRef = ref<InstanceType<typeof BasicInfoEditDialog> | null>(null);
const openEditBasicInfoDialog = (info: any) => {
	const params = {
		info: { ...info },
	};
	editBasicInfoDialogRef.value?.acceptParams(params);
};

// 申请权限弹窗
const tablePerAppDialogRef = ref<InstanceType<typeof TablePerAppDialog> | null>(null);
const openTablePerAppDialog = (info: any) => {
	const params = {
		info: info,
	};
	tablePerAppDialogRef.value?.acceptParams(params);
};
// const queryFormRaw = {
// 	// name: "",
// };

// const beanInfo = {};

// let {
// 	tableLoading,
// 	// tableMaxHeight,
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
// 	getAdvancedSearchListApi, //temp test

// 	beanInfo,
// 	queryFormRaw
// );

onMounted(async () => {
	await getTableInfo();
	getUserFavorList({ id: userStore.userInfoGet.id });
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>
