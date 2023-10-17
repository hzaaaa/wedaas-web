<template>
	<div>
		<el-dialog v-model="dialogVisible" title="获取数据" @open="getExpireInfo" width="1100px" class="common-dialog">
			<div class="content-body">
				<div class="table-wrap" :class="asideClass" style="">
					<Transition>
						<el-table
							v-if="asideClass === 'wider-at-hook'"
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
					</Transition>
				</div>
				<div class="icon-wrap">
					<el-icon v-if="asideClass === 'wider-at-hook'" @click="foldClick"><ArrowUp /></el-icon>
					<el-icon v-if="asideClass === 'narrower-at-hook'" @click="expandClick"><ArrowDown /></el-icon>
				</div>
				<div class="result-wrap" style="">
					<el-table
						v-if="resultDataList.length !== 0"
						class="common-table"
						:data="resultDataList"
						border
						style="
							border-radius: 4px;
							border: 1px solid rgb(232, 232, 232);
							height: 100%;
							max-height: 100%;
							box-sizing: border-box;
						"
					>
						<el-table-column type="index" label=" " />
						<template v-for="item in sqlQueryResult.data.ddl">
							<el-table-column sortable min-width="120" :label="item" :prop="item" show-overflow-tooltip></el-table-column>
						</template>
					</el-table>
					<el-empty v-if="resultDataList.length === 0" style="height: 100%" description="description" />
				</div>
			</div>
			<template #footer>
				<el-button type="primary" @click="">查看</el-button>
				<el-button type="primary" @click="submit"> 下载数据 </el-button>
				<!-- <el-button @click="check">check</el-button> -->
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import detailsDataJson from "./detailsData.json";
import sqlQueryResult from "./sqlQueryResult.json";
import useFoldOrExpandHook from "@/hooks/foldOrExpandHook";
let { asideClass, foldClick, expandClick } = useFoldOrExpandHook();
let allData = detailsDataJson.data;
const tableIndata = ref([...allData.apiParamIn]);
const buildResultList = (inputList: any) => {
	let resultList = <any>[];
	let rowList = inputList.ddl;
	for (let j = 0; j < inputList.list.length; j++) {
		let itemList = inputList.list[j];
		let itemObj = <any>{};
		for (let i = 0; i < rowList.length; i++) {
			let name = rowList[i];
			itemObj[name] = itemList[i];
		}
		resultList.push(itemObj);
	}
	return resultList;
};
let resultList = buildResultList(sqlQueryResult.data);
const resultDataList = ref(resultList);
// const resultDataList = ref([]);

const dialogVisible = ref(false);

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
	// padding-bottom: 0 !important;
}
.content-body {
	width: 100%;
	height: 60vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}
.icon-wrap {
	text-align: center;
}
.table-wrap {
	transition: all 0.3s; //过渡
	// max-height: 350px;
	height: 240px;
	// display: flex;
	flex-direction: column;
}
.narrower-at-hook {
	height: 0 !important; //过渡
}
.result-wrap {
	flex: 1;
	position: relative;
	border-bottom: 1px solid #e8e8e8;
	overflow: hidden;
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
