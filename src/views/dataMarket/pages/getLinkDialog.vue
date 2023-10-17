<template>
	<div>
		<el-dialog v-model="dialogVisible" title=" " @open="getExpireInfo" width="1100px" class="expire common-dialog">
			<el-tabs class="full-content-tabs" v-model="activeTab">
				<el-tab-pane label="请求参数" name="请求参数">
					<div class="table-wrap" style="">
						<el-table
							class="common-table"
							:data="tableIndata"
							border
							style="
								border-radius: 4px;
								border: 1px solid rgb(232, 232, 232);
								height: 100%;
								max-height: 100%;
								box-sizing: border-box;
							"
						>
							<el-table-column label="参数名" prop="fieldName" show-overflow-tooltip></el-table-column>
							<el-table-column label="描述" prop="colDescription" show-overflow-tooltip></el-table-column>
							<el-table-column label="类型" prop="columnType" show-overflow-tooltip></el-table-column>
							<el-table-column label="值" prop="defaultValue" show-overflow-tooltip>
								<template #default="scope">
									<el-input v-model="scope.row.value" maxlength="100" />
								</template>
							</el-table-column>
							<el-table-column label="必填" prop="required" show-overflow-tooltip></el-table-column>
						</el-table>
					</div>
				</el-tab-pane>
				<el-tab-pane label="分页参数" name="分页参数">
					<div class="table-wrap" style="">
						<el-table
							class="common-table"
							:data="pageData"
							border
							style="
								border-radius: 4px;
								border: 1px solid rgb(232, 232, 232);
								height: 100%;
								max-height: 100%;
								box-sizing: border-box;
							"
						>
							<el-table-column label="参数名" prop="paramName" show-overflow-tooltip></el-table-column>
							<el-table-column label="条件" prop="condition" show-overflow-tooltip></el-table-column>

							<el-table-column label="值" prop="value" show-overflow-tooltip>
								<template #default="scope">
									<el-input v-model="scope.row.value" maxlength="100" />
								</template>
							</el-table-column>
							<el-table-column label="必填" prop="required" show-overflow-tooltip></el-table-column>
						</el-table>
					</div>
				</el-tab-pane>
			</el-tabs>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submit"> 生成API链接 </el-button>
				<!-- <el-button @click="check">check</el-button> -->
				<div class="link-block">
					<div class="content">
						{{
							`curl -XGET "${location.protocol}//${location.host}:${location.port}/api/edu/educode/cc189c99-6fbd-41bf-bc0f-8c02d0274716"`
						}}
					</div>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import detailsDataJson from "./detailsData.json";
let allData = detailsDataJson.data;
const tableIndata = ref([...allData.apiParamIn]);
const pageData = ref([
	{
		paramName: "page_num",
		condition: "=",
		value: "",
		required: false,
	},
	{
		paramName: "page_size",
		condition: "=",
		value: "",
		required: false,
	},
]);
const activeTab = ref("请求参数");
const dialogVisible = ref(false);
const location = <any>window.location;
const dialogProps = ref<any>();

const acceptParams = (params: any) => {
	dialogProps.value = params;
	// debugger
	dialogProps.value.loginExpireList = [params.row.expirationStart, params.row.expirationEnd];
	dialogVisible.value = true;
};

// 提交
const submit = async () => {
	try {
		console.log("dialogProps.value.loginExpireList", dialogProps.value.loginExpireList);
		// return
		// debugger
		let params = {
			userId: dialogProps.value.row!.id,
			expirationStart: dialogProps.value.loginExpireList[0],
			expirationEnd: dialogProps.value.loginExpireList[1],
		};
		// await editExpirationApi(params);
		// ElMessage.success("修改有效期成功");
		dialogVisible.value = false;
		emit("refreshData");
	} catch (err) {}
};
const getExpireInfo = () => {};

const emit = defineEmits(["refreshData"]);

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
	padding-bottom: 0 !important;
}
.table-wrap {
	max-height: 980px;
	height: 45vh;
	// display: flex;
	flex-direction: column;
}
:deep(.el-dialog__body) {
	display: flex;
	flex-direction: column;
}
:deep(.el-dialog__footer) {
	padding-top: 0;
}
.link-block {
	background: #f8f8f8;
	border-radius: 4px;
	min-height: 112px;
	margin: 16px 0 0;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	padding: 8px 16px;
	margin-top: 30px;
	.content {
		font-weight: 400;
		font-size: 13px;
		line-height: 16px;
		color: var(--colormaintext);
		margin-right: 16px;
		height: 100px;
		overflow: auto;
		padding: 8px 0;
		word-wrap: break-word;
		word-break: break-all;
	}
}
</style>
