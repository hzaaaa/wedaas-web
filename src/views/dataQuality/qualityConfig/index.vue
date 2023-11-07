<template>
	<div class="qualityConfig">
		<div class="quality-header">数据配置</div>
		<div class="quality-table">
			<el-table
				class="common-table"
				v-loading="tableLoading"
				:data="tableDataList"
				border
				style="flex: 1 !important; height: auto"
				ref="multipleTableRef"
				:default-sort="{ prop: 'update_time', order: 'descending' }"
			>
				<el-table-column label="数据源" prop="" show-overflow-tooltip>
					<template #default="scope"> {{ scope.row.data_source_id.split(".")[0] }}</template>
				</el-table-column>

				<el-table-column label="数据库" prop=" " show-overflow-tooltip>
					<template #default="scope"> {{ scope.row.data_source_id.split(".")[1] }}</template>
				</el-table-column>

				<el-table-column label="数据库类型" prop="type" show-overflow-tooltip> </el-table-column>
				<el-table-column label="完成情况" prop=" " show-overflow-tooltip>
					<template #default="scope"> {{ scope.row.total_run ? `${scope.row.total_run}/${scope.row.total}` : "暂无" }}</template>
				</el-table-column>
				<el-table-column label="创建时间" prop=" " width="230">
					<template #default="scope">
						<el-date-picker
							@change="editConfigEvent(scope.row)"
							style="width: 100%"
							v-model="scope.row.run_time"
							type="datetime"
							placeholder="暂未设置"
							:clearable="false"
						/>
					</template>
				</el-table-column>
				<el-table-column label="运行时长" prop=" " width="160">
					<template #default="scope">
						<el-select
							v-model="scope.row.run_hours"
							placeholder="请选择"
							style="width: 100%"
							@change="editConfigEvent(scope.row)"
						>
							<el-option v-for="item in 24" :key="item" :label="item" :value="item" />
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="运行项" prop=" " width="160">
					<template #default="scope">
						<el-select v-model="scope.row.run_item" placeholder="请选择" style="width: 100%" @change="editConfigEvent(scope.row)">
							<el-option
								v-for="item in [
									{
										value: 'all',
										label: '全部',
									},
									{
										value: '1',
										label: '仅扫表行数',
									},
								]"
								:key="item.value"
								:label="item.label"
								:value="item.value"
							/>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="80" header-align="left" align="left" fixed="right">
					<template #default="scope">
						<div class="flex-left">
							<span class="two-word-button">
								<el-button type="primary" link @click="deleteClick(scope.row)">删除</el-button>
								<el-button type="info" class="button-hold-position" disabled link>删除</el-button>
							</span>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<div class="quality-page">
			<el-pagination
				:page-sizes="pageParams.pageSizesList"
				background
				layout="total,sizes,prev, pager, next,jumper"
				@size-change="handleSizeChange"
				@current-change="handleCurrentPageChange"
				:current-page="pageParams.pageNum"
				:page-size="pageParams.pageSize"
				:total="pageParams.total"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import {} from "vue";
import useListPageHook from "./listPage";

import { editQualityConfigApi, getQualityConfigListApi } from "@/api/modules/dataQuality/qualityConfig";

const deleteClick = (row: any) => {
	ElMessageBox.confirm("是否删除已配置好的设置?", `删除配置-${row.data_source_id.split(".")[1]}`, {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		customClass: "delete-message",
		// type: "warning",
	})
		.then(() => {
			editQualityConfigApi({
				dbName: row.db_name,
				dbType: row.type,
				dsID: row.data_source_id,
				now: 0,
				runHours: 0,
				runItem: "",
				runTime: 0,
			}).then(() => {
				ElMessage.success("重置成功");
				refreshData();
			});
		})
		.catch(() => {});
};
const editConfigEvent = (row: any) => {
	// if()

	if (row.run_time && row.run_hours && row.run_item) {
		// debugger;
		let now = 0;
		let dateNumberS = Math.floor(new Date().getTime() / 1000);
		// if()
		let run_timeS = Math.floor(new Date(row.run_time).getTime() / 1000);
		if (dateNumberS === run_timeS) {
			now = 1;
		}
		// debugger;
		console.log("now", 1);
		editQualityConfigApi({
			dbName: row.db_name,
			dbType: row.type,
			dsID: row.data_source_id,
			now,
			runHours: row.run_hours,
			runItem: row.run_item,
			runTime: run_timeS,
		}).then(() => {
			ElMessage.success("修改成功");
			refreshData();
		});
	}
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
	getQualityConfigListApi, //temp test

	beanInfo,
	queryFormRaw,
	null,
	() => {
		tableDataList.value.forEach((item: any) => {
			item.run_hours = item.run_hours || null;
		});
	}
);
</script>

<style lang="scss" scoped>
.qualityConfig {
	height: 0;
	flex: 1;
	display: flex;
	flex-direction: column;

	padding: 24px;
	background: #fff;
	border-radius: 4px;
	.quality-header {
		font-weight: 500;
		font-size: 14px;
		line-height: 16px;
		color: var(--colormaintext);
		padding-bottom: 16px;
		border-bottom: 1px solid var(--bc);
	}
	.quality-table {
		width: 100%;
		margin-top: 16px;
		flex: 1;
		height: 0;
		display: flex;
		flex-direction: column;
	}
	.quality-page {
		padding-top: 16px;
		text-align: right;
		display: flex;
		justify-content: flex-end;
	}
}
</style>
