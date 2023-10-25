<template>
	<el-dialog title="查看" class="app-log-view-dialog" v-model="dialogVisible" @open="openDialog()">
		<div class="app-info-wrapper">
			<el-row class="app-info-row" justify="space-between">
				<el-col :span="10" class="app-info-item"><span>申请人：</span><span>yucheng</span></el-col>
				<el-col :span="5" class="app-info-item"><span>数据类型：</span><span>TABLE</span></el-col>
				<el-col :span="7" class="app-info-item last-item"><span>审批状态：</span><span>已批准</span></el-col>
			</el-row>
			<el-row class="app-info-row api-info" justify="space-between" v-if="appLogType == 0">
				<el-col :span="10" class="app-info-item"><span>API名称：</span><span>数据服务测试管理</span></el-col>
				<el-col :span="5" class="app-info-item"><span>创建人：</span><span>admin</span></el-col>
				<el-col :span="7" class="app-info-item last-item"><span>发布状态：</span><span>已发布</span></el-col>
			</el-row>
			<div class="table-info" v-else>
				<el-row class="app-info-row" justify="space-between">
					<el-col :span="10" class="app-info-item"><span>数据源：</span><span>mysql</span></el-col>
					<el-col :span="5" class="app-info-item"><span>数据库：</span><span>gmail</span></el-col>
					<el-col :span="7" class="app-info-item last-item"><span>表名：</span><span>activity_rule</span></el-col>
				</el-row>
				<el-row class="app-info-row">
					<el-col class="app-info-item"><span>权限：</span><span>读权限</span></el-col>
				</el-row>
			</div>
		</div>
		<div class="app-log-table-wrapper">
			<el-table
				v-loading="tableLoading"
				:data="tableDataList"
				cell-class-name="table-cell"
				header-cell-class-name="header-cell"
				class="common-table"
				height="100%"
				border
			>
				<el-table-column label="申请记录" prop="desc" />

				<el-table-column label="发生时间" prop="tableName" width="100px"> </el-table-column>
			</el-table>
		</div>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false"> 关闭 </el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import useListPageHook from "@/hooks/listPage";
import { getMySaveListApi } from "@/api/modules/mock/mock";
const dialogVisible = ref(false);

interface DialogProps {
	info: any;
	// api?: (params: any) => Promise<any>;
}

const dialogProps = ref<DialogProps>({
	info: "",
});

const acceptParams = (params: DialogProps) => {
	console.log(params);
	dialogProps.value = params;
	dialogVisible.value = true;
};

const appLogType = ref(0);

const tableLoading = ref(false);

const tableDataList = ref([]);

const getAppLog = async () => {
	try {
		const { data } = await getMySaveListApi();
		tableDataList.value = data.list;
	} catch (err) {
		console.error(err);
	}
};

const openDialog = () => {
	getAppLog();
};

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped>
.el-dialog.app-log-view-dialog {
	.app-info-wrapper {
		padding: 16px 24px;
		border-radius: 4px;
		background: #f8f8f8;
		.el-row.app-info-row {
			.el-col.app-info-item.last-item {
				text-align: right;
			}
		}

		// }
	}
	.app-log-table-wrapper {
		height: 300px;
	}
}
</style>
