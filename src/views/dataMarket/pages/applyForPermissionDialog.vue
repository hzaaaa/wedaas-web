<template>
	<div>
		<el-dialog v-model="dialogVisible" title="申请表权限" @open="getExpireInfo" width="640px" class="common-dialog">
			<div class="content-body">
				<div class="table-info">
					<div class="desc">
						<div class="thin-scrollbar">
							教育网信息数据（教育代码、学校名称、是否双一流、是否985、是否211）
							教育网信息数据（教育代码、学校名称、是否双一流、是否985、是否211）
							教育网信息数据（教育代码、学校名称、是否双一流、是否985、是否211）
						</div>
					</div>
					<div class="details">
						<div class="table-name">教育网信息数据</div>
						<div class="info-list">
							<div class="info-item">admin</div>
							<div class="info-item">2023-09-26</div>
							<div class="info-item">已发布</div>
						</div>
					</div>
				</div>
				<div class="user-info">
					<div class="common-info">
						<div class="key">用户名</div>
						<div class="value">用户名</div>
					</div>
					<div class="common-info">
						<div class="key">邮箱</div>
						<div class="value">邮箱</div>
					</div>
				</div>
				<div class="input-info">
					<el-form ref="inputInfoRef" :model="inputInfo" :rules="rulesForm" label-position="top">
						<el-form-item label="申请原因" prop="reason">
							<el-input v-model="inputInfo.reason" type="textarea" maxlength="500" show-word-limit rows="5" placeholder="" />
						</el-form-item>
					</el-form>
				</div>
			</div>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submit"> 申请 </el-button>
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
import type { FormInstance, FormRules } from "element-plus";

let allData = detailsDataJson.data;
const tableIndata = ref([...allData.apiParamIn]);
const inputInfo = ref({
	reason: "",
});
const rulesForm = reactive<any>({
	reason: [{ required: true, message: "请输入申请理由!", trigger: "blur" }],
});

const dialogVisible = ref(false);

const dialogProps = ref<any>();

const acceptParams = (params: any) => {
	dialogProps.value = params;
	// debugger
	dialogProps.value.loginExpireList = [params.row.expirationStart, params.row.expirationEnd];
	dialogVisible.value = true;
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
	// dialogVisible.value = false;
	// emit("refreshData");
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
* {
	box-sizing: border-box;
}
.content-body {
	width: 100%;
	// height: 60vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	.table-info {
		margin-bottom: 16px;
		display: flex;
		.desc {
			padding: 20px;
			background: #fff;
			border-radius: 4px;
			border: 1px solid var(--bc);
			height: 120px;
			width: 272px;
			div {
				overflow: auto;
				height: 100%;
			}
		}
		.details {
			margin: 0 0 0 48px;
			flex: 1;
			max-width: 256px;
			.table-name {
				border-bottom: 1px solid var(--bc);
				font-weight: 500;
				font-size: 13px;
				line-height: 16px;
				letter-spacing: 0.01em;
				color: var(--colormaintext);
				padding-bottom: 8px;
			}
			.info-list {
				.info-item {
					font-size: 13px;
					line-height: 24px;
					color: rgba(var(--color39), 0.7);
				}
			}
		}
	}
	.user-info {
		.common-info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 16px;
			background: #f7fafc;
			border-radius: 4px;
			margin-bottom: 16px;
			.key {
				font-weight: 500;
				font-size: 13px;
				line-height: 16px;
				color: var(--colormaintext);
			}
			.value {
				font-size: 13px;
				line-height: 16px;
				color: var(--colormaintext);
			}
		}
	}
	.input-info {
		padding: 8px 16px 16px;
		background: #f7fafc;
		border-radius: 4px;
	}
}
.icon-wrap {
	text-align: center;
}

:deep(.el-dialog__body) {
	display: flex;
	flex-direction: column;
}
:deep(.el-dialog__footer) {
	padding-top: 0;
}
:deep(.el-form-item__label:before) {
	position: absolute;
	right: 0;
}
:deep(.el-form-item__label) {
	position: relative;
	padding: 0 14px 0 0;
	float: none;
	display: inline-block !important;
	text-align: left;
}
</style>
