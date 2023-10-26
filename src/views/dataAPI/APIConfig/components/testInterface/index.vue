<template>
	<div class="test-interface">
		<div class="invoking-content">
			<div class="content-left">
				<div class="title pointer">请求参数</div>
				<div class="params-block">
					<el-table
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
					<el-button type="primary" @click="">开始测试</el-button>
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
	</div>
</template>

<script setup lang="ts">
import {} from "vue";
import useListPageHook from "@/hooks/listPage";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
let jsonTest_header = ref<any>({
	a: 123,
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
	// list = listDataJson.data.list;
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
.test-interface {
	flex: 1;
	height: 0;
	display: flex;
	width: 100%;
	position: relative;
	padding-left: 16px;
	padding-right: 16px;
	.invoking-content {
		width: 100%;
		height: 100%;
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
}
</style>
