<template>
	<div>
		<el-dialog v-model="dialogVisible" title="参数列表" @open="getExpireInfo" width="800px" class="common-dialog">
			<div class="content-body">
				<div class="result-wrap" style="">
					<el-table
						v-if="paramDataList.length !== 0"
						class="common-table"
						:data="paramDataList"
						border
						style="box-sizing: border-box; border: 1px solid rgb(232 232 232); border-radius: 4px; height: 100%; max-height: 100%"
					>
						<el-table-column min-width="120" label="字段名" prop="fieldName" show-overflow-tooltip>
							<template #default="scope">
								<el-input v-model="scope.row.fieldName" style="width: 100%" />
							</template>
						</el-table-column>
						<el-table-column min-width="120" label="类型" prop="columnType" show-overflow-tooltip>
							<template #default="scope">
								<el-select v-model="scope.row.columnType" placeholder="请选择" style="width: 100%">
									<el-option v-for="item in ['raw', 'number', 'string']" :key="item" :label="item" :value="item" />
								</el-select>
							</template>
						</el-table-column>
						<el-table-column min-width="120" label="测试值" prop="defaultValue" show-overflow-tooltip>
							<template #default="scope">
								<el-input v-model="scope.row.defaultValue" style="width: 100%" />
							</template>
						</el-table-column>
					</el-table>
					<el-empty v-if="paramDataList.length === 0" style="height: 100%" description="description" />
				</div>
			</div>
			<template #footer>
				<el-button type="primary" @click="submit"> 执行 </el-button>
				<!-- <el-button @click="check">check</el-button> -->
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";

import useFoldOrExpandHook from "@/hooks/foldOrExpandHook";
let { asideClass, foldClick, expandClick } = useFoldOrExpandHook();
import { buildSQLApi, discardSqlApi } from "@/api/modules/sqlQuery/index";
const paramDataList = ref([]);
// const paramDataList = ref([]);

const dialogVisible = ref(false);

const dialogProps = ref<any>();

const acceptParams = (params: any) => {
	dialogProps.value = params;
	// debugger
	paramDataList.value = params.list;
	dialogVisible.value = true;
};

// 提交
const submit = async () => {
	try {
		// let params = {
		// 	paramIns: [],
		// 	param: {},
		// 	apiBase: {
		// 		databaseType: dbRawInfo.value.dbObj.type,
		// 		isSql: 1,
		// 		templateSql: stringInput.value,
		// 	},
		// };
		// buildSQLApi
		dialogVisible.value = false;
		emit("exec", paramDataList.value);
	} catch (err) {}
};
const getExpireInfo = () => {};

const emit = defineEmits(["refreshData"]);

defineExpose({
	acceptParams,
	dialogVisible,
});
</script>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
	// padding-bottom: 0 !important;
}
.content-body {
	display: flex;
	overflow: hidden;
	flex-direction: column;
	width: 100%;
	max-height: 60vh;
}
.icon-wrap {
	text-align: center;
}
.table-wrap {
	// display: flex;
	flex-direction: column;

	// max-height: 350px;
	height: 240px;
	transition: all 0.3s; //过渡
}
.narrower-at-hook {
	height: 0 !important; //过渡
}
.result-wrap {
	overflow: hidden;
	position: relative;
	flex: 1;
	border-bottom: 1px solid #e8e8e8;
	border-radius: 4px;
}
:deep(.el-dialog__body) {
	display: flex;
	flex-direction: column;
}
:deep(.el-dialog__footer) {
	padding-top: 0;
}
.link-block {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin: 16px 0 0;
	margin-top: 30px;
	padding: 8px 16px;
	border-radius: 4px;
	min-height: 112px;
	background: #f8f8f8;
	.content {
		overflow: auto;
		margin-right: 16px;
		padding: 8px 0;
		height: 100px;
		line-height: 16px;
		font-weight: 400;
		font-size: 13px;
		color: var(--colormaintext);
		word-wrap: break-word;
		word-break: break-all;
	}
}
</style>
