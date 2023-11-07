<template>
	<div class="">
		<el-dialog v-model="dialogVisible_details" title="API详情信息" @open="getLabelInfo" width="1000px" class="common-dialog">
			<div class="content-header">
				<el-row>
					<el-col :span="6">
						<div class="cell">
							<div class="title">API名称：</div>
							<div class="content">
								<div class="content-left">
									<div class="desc mod-ellipsis">{{ detailsInfo?.name }}</div>
								</div>
								<div class="edit-icon pointer">
									<el-icon><EditPen /></el-icon>
								</div>
							</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="cell">
							<div class="title">目录：</div>
							<div class="content">
								<div class="content-left">
									<!-- <div class="desc mod-ellipsis">{{ detailsInfo?.name }}</div> -->
								</div>
								<div class="edit-icon pointer"></div>
							</div>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="cell">
							<div class="title">描述：</div>
							<div class="content">
								<div class="content-left">
									<div class="desc mod-ellipsis">{{ detailsInfo?.description }}</div>
								</div>
								<div class="edit-icon pointer"></div>
							</div>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">
						<div class="cell">
							<div class="title">数据源：</div>
							<div class="content">
								<div class="content-left">
									<div class="desc mod-ellipsis">{{ detailsInfo?.datasourceId && detailsInfo?.datasourceId.split(".")[0] }}</div>
								</div>
								<div class="edit-icon pointer"></div>
							</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="cell">
							<div class="title">数据库：</div>
							<div class="content">
								<div class="content-left">
									<div class="desc mod-ellipsis">{{ detailsInfo?.datasourceId && detailsInfo?.datasourceId.split(".")[1] }}</div>
								</div>
								<div class="edit-icon pointer"></div>
							</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="cell">
							<div class="title">返回类型：</div>
							<div class="content">
								<div class="content-left">
									<div class="desc mod-ellipsis">{{ detailsInfo?.responseType }}</div>
								</div>
								<div class="edit-icon pointer"></div>
							</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="cell">
							<div class="title">请求方式：</div>
							<div class="content">
								<div class="content-left">
									<div class="desc mod-ellipsis">{{ detailsInfo?.requestMethod }}</div>
								</div>
								<div class="edit-icon pointer"></div>
							</div>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">
						<div class="cell">
							<div class="title">表名：</div>
							<div class="content">
								<div class="content-left">
									<div class="desc mod-ellipsis">{{ detailsInfo?.tablesName }}</div>
								</div>
								<div class="edit-icon pointer"></div>
							</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="cell">
							<div class="title">路径：</div>
							<div class="content">
								<div class="content-left">
									<div class="desc mod-ellipsis">{{ detailsInfo?.path }}</div>
								</div>
								<div class="edit-icon pointer"></div>
							</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="cell">
							<div class="title">分时限流：</div>
							<div class="content">
								<div class="content-left">
									<!-- <div class="desc mod-ellipsis">{{ detailsInfo?.requestMethod }}</div> -->
								</div>
								<div class="edit-icon pointer"></div>
							</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="cell">
							<div class="title">版本：</div>
							<div class="content">
								<div class="content-left">
									<div class="desc mod-ellipsis">{{ detailsInfo?.version }}</div>
								</div>
								<div class="edit-icon pointer"></div>
							</div>
						</div>
					</el-col>
				</el-row>
			</div>
			<div class="tabs-header pointer">
				<span class="mr20" :class="currentTab === '请求参数' ? 'tabs-active' : ''" @click="currentTab = '请求参数'"
					>请求参数</span
				>
				<span class="mr20" :class="currentTab === '返回参数' ? 'tabs-active' : ''" @click="currentTab = '返回参数'"
					>返回参数</span
				>
				<span class="mr20" :class="currentTab === '分享记录' ? 'tabs-active' : ''" @click="currentTab = '分享记录'"
					>分享记录</span
				>
			</div>
			<div class="table-block">
				<el-table
					v-if="currentTab === '请求参数'"
					class="common-table"
					:data="paramInTableList"
					border
					style="flex: 1 !important; height: auto"
					ref="multipleTableRef"
					:default-sort="{ prop: 'update_time', order: 'descending' }"
				>
					<el-table-column label="字段名" prop="name" show-overflow-tooltip> </el-table-column>

					<el-table-column label="描述" prop="colDescription" show-overflow-tooltip> </el-table-column>

					<el-table-column label="类型" prop="columnType" show-overflow-tooltip-none></el-table-column>
					<el-table-column label="默认值" prop="defaultValue" show-overflow-tooltip-none> </el-table-column>
					<el-table-column label="必填" prop="required" show-overflow-tooltip-none> </el-table-column>
				</el-table>
				<el-table
					v-if="currentTab === '返回参数'"
					class="common-table"
					:data="paramOutTableList"
					border
					style="flex: 1 !important; height: auto"
					ref="multipleTableRef"
					:default-sort="{ prop: 'update_time', order: 'descending' }"
				>
					<el-table-column label="字段名" prop="name" show-overflow-tooltip> </el-table-column>

					<el-table-column label="描述" prop="colDescription" show-overflow-tooltip> </el-table-column>

					<el-table-column label="类型" prop="columnType" show-overflow-tooltip-none></el-table-column>
				</el-table>
				<el-table
					v-if="currentTab === '分享记录'"
					class="common-table"
					:data="shareRecordTableList"
					border
					style="flex: 1 !important; height: auto"
					ref="multipleTableRef"
					:default-sort="{ prop: 'update_time', order: 'descending' }"
				>
					<!-- 待修改 -->
					<el-table-column label="id" prop="name" show-overflow-tooltip> </el-table-column>

					<el-table-column label="SQL" prop="excuteSql" show-overflow-tooltip> </el-table-column>

					<el-table-column label="提取码" prop="extractionCode" show-overflow-tooltip-none></el-table-column>
					<el-table-column label="允许次数" prop="times" show-overflow-tooltip-none> </el-table-column>
					<el-table-column label="下载次数" prop="callTotal" show-overflow-tooltip-none> </el-table-column>
					<el-table-column label="最近下载时间" prop="recentTime" show-overflow-tooltip-none> </el-table-column>
				</el-table>
			</div>
			<template #footer>
				<el-button @click="dialogVisible_details = false">取消</el-button>
				<el-button type="primary" @click="nextPage">进入调用页面</el-button>
				<!-- <el-button @click="check">check</el-button> -->
			</template>
		</el-dialog>
		<el-dialog
			v-model="dialogVisible_invoking_interface"
			title="用户查询接口"
			@open="getLabelInfo"
			width="1000px"
			class="common-dialog"
		>
			<div class="invoking-content">
				<div class="content-left">
					<div class="title pointer">请求参数</div>
					<div class="params-block">
						<el-table
							v-if="currentTab === '请求参数'"
							class="common-table"
							:data="tableDataList"
							border
							style="flex: 1 !important; height: auto"
							ref="multipleTableRef"
							:default-sort="{ prop: 'update_time', order: 'descending' }"
						>
							<el-table-column label="字段名" prop="name" show-overflow-tooltip> </el-table-column>

							<el-table-column label="描述" prop="description" show-overflow-tooltip> </el-table-column>

							<el-table-column label="类型" prop="createBy" show-overflow-tooltip-none></el-table-column>
							<el-table-column label="默认值" prop="createTime" show-overflow-tooltip-none> </el-table-column>
							<el-table-column label="必填" prop="status" show-overflow-tooltip-none> </el-table-column>
						</el-table>
					</div>
					<div class="btn-block">
						<el-button @click="prePage">上一步</el-button>
						<el-button type="primary" @click="submit">开始测试</el-button>
					</div>
				</div>
				<div class="content-right">
					<div class="result-header thin-scrollbar">
						<!-- <el-scrollbar> -->
						<vue-json-pretty v-model:data="jsonTest_header"></vue-json-pretty>
						<!-- </el-scrollbar> -->
					</div>
					<div class="result-center">
						<div class="result-center-title">请求详情</div>
						<div class="result-center-content thin-scrollbar">
							<div class="content-tem">请求协议: http</div>
							<div class="content-tem">请求方式: get</div>
							<div class="content-tem">返回类型: json</div>
							<div class="content-tem" v-pre>
								SQL模板: SELECT access_id , source_code , query_times , query_success_times , success_rate , dt FROM
								audit_service.audit_day_provider WHERE access_id={{ access_id0 }} AND source_code={{ source_code1 }} AND
								query_times={{ query_times2 }} AND query_success_times={{ query_success_times3 }} AND success_rate={{
									success_rate4
								}}
								AND dt={{ dt5 }}
							</div>
							<div class="content-tem" v-pre>
								SQL模板: SELECT access_id , source_code , query_times , query_success_times , success_rate , dt FROM
								audit_service.audit_day_provider WHERE access_id={{ access_id0 }} AND source_code={{ source_code1 }} AND
								query_times={{ query_times2 }} AND query_success_times={{ query_success_times3 }} AND success_rate={{
									success_rate4
								}}
								AND dt={{ dt5 }}
							</div>
						</div>
					</div>
					<div class="result-footer">
						<div class="title">接口分析</div>
						<div class="content">
							<span>响应时长: 487 ms</span>
							<span>应用响应: 0 ms</span>
							<span>数据库响应: 487 ms</span>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage, type FormInstance, type FormRules, type TabsPaneContext } from "element-plus";
import listDataJson from "../listData.json";
import useListPageHook from "@/hooks/listPage";
import { getApiDetailsApi, getApiShareRecordApi } from "@/api/modules/dataApi/apiCatalog";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

const nextPage = () => {
	dialogVisible_details.value = false;
	dialogVisible_invoking_interface.value = true;
};
const prePage = () => {
	dialogVisible_details.value = true;
	dialogVisible_invoking_interface.value = false;
};
const currentTab = ref("请求参数");
const inputInfo = ref({
	name: "",
});
const detailsInfo = <any>ref({});
const rulesForm = reactive<any>({
	name: [{ required: true, message: "请输入主目录名称!", trigger: "blur" }],
});
let jsonTest_header = ref<any>(listDataJson);
const dialogVisible_details = ref(false);
const dialogVisible_invoking_interface = ref(false);

const dialogProps = ref<any>({
	row: {
		status: 0,
	},
});
const paramInTableList = <any>ref([]);
const paramOutTableList = <any>ref([]);
const shareRecordTableList = <any>ref([]);
const acceptParams = (params: any) => {
	dialogProps.value = params;
	dialogVisible_details.value = true;

	getApiDetailsApi({ id: params.row.id }).then((res: any) => {
		// debugger;
		detailsInfo.value = res.data.apiBase;
		paramInTableList.value = res.data.paramIn;
		paramOutTableList.value = res.data.paramOut;
		// detailsInfo.value = res.data.apiBase;
	});
	getApiShareRecordApi({ id: params.row.id }).then((res: any) => {
		shareRecordTableList.value = res.data;
	});
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
	// dialogVisible_details.value = false;
	// emit("refreshData");
};
const getLabelInfo = () => {};

const emit = defineEmits(["refreshData"]);

defineExpose({
	acceptParams,
});

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
	list = listDataJson.data.list;
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
</script>

<style lang="scss" scoped>
.content-header {
	position: relative;
	margin-top: 16px;
	padding: 12px 24px;
	background: var(--cardbg);
	border-radius: 4px;
	overflow: hidden;
	.cell {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		min-height: 32px;
		margin: 8px 0;
		.title {
			font-weight: 400;
			font-size: 13px;
			line-height: 16px;
			letter-spacing: 0.04em;
			color: rgba(0, 0, 0, 0.85);
			min-width: 41px;
		}
		.content {
			font-weight: 400;
			font-size: 13px;
			line-height: 16px;
			color: #68686d;
			overflow: hidden;
			flex: 1;
			display: flex;
			align-items: center;
			.content-left {
				max-width: 81%;
				.desc {
					max-width: 100%;
				}
			}
			.edit-icon {
				height: 16px;
				flex: 1;
				margin-left: 4px;
				position: relative;
				display: flex;
				align-items: center;
			}
		}
	}
}
.tabs-header {
	margin-top: 15px;
	height: 23px;
	font-weight: 400;
	font-size: 13px;
	line-height: 16px;
	letter-spacing: 0.01em;
	color: var(--colormaintext);
}
.tabs-active {
	color: var(--el-color-primary);
}
.table-block {
	height: 285px;
	border: 1px solid rgba(var(--color39), 0.08);
	margin-bottom: 16px;
	display: flex;
	flex-direction: column;
}
.invoking-content {
	width: 100%;
	height: 60vh;
	display: flex;
	padding: 16px 0;
	.content-left {
		position: relative;
		overflow: hidden;
		width: 64%;
		display: flex;
		flex-direction: column;
		.title {
			font-weight: 500;
			font-size: 14px;
			line-height: 16px;
			color: var(--colormaintext);
			padding-bottom: 8px;
		}
		.params-block {
			height: 0;
			flex: 1;
			border: 1px solid var(--bc);
			border-radius: 4px;
			display: flex;
			flex-direction: column;
		}
		.btn-block {
			display: flex;
			padding: 40px 0 0;
			justify-content: center;
			align-items: center;
		}
	}
	.content-right {
		width: 36%;
		padding-left: 16px;
		margin-top: 24px;
		// padding-bottom: 24px;
		position: relative;
		display: flex;

		flex-direction: column;
		.result-header {
			position: relative;
			height: 0;
			flex: 1;
			overflow: auto;
			border: 1px solid var(--bc);
			box-sizing: border-box;
			border-radius: 4px;
		}
		.result-center {
			margin-top: 16px;
			flex: 1;
			height: 0;
			// max-height: 200px;
			// min-height: 108px;
			display: flex;
			flex-direction: column;
			.result-center-title {
				font-weight: 500;
				font-size: 13px;
				line-height: 16px;
				letter-spacing: 0.01em;
				color: var(--colormaintext);
			}
			.result-center-content {
				overflow: auto;
				margin-top: 8px;
				padding: 0 16px;
				border: 1px solid var(--bc);
				border-radius: 4px;

				.content-tem {
					font-weight: 400;
					font-size: 13px;
					line-height: 16px;
					color: rgba(var(--color39), 0.7);
					margin: 16px 0;
				}
			}
		}
		.result-footer {
			// flex: 1;
			// height: 0;
			margin-top: 16px;
			margin-bottom: 72px;
			.title {
				font-weight: 500;
				font-size: 13px;
				line-height: 16px;
				letter-spacing: 0.01em;
				color: var(--colormaintext);
			}
			.content {
				width: 100%;
				margin-top: 8px;
				font-weight: 400;
				font-size: 12px;
				line-height: 16px;
				color: rgba(var(--color39), 0.7);
				display: inline-flex;
				justify-content: space-between;
				align-items: center;
			}
		}
	}
}
</style>
