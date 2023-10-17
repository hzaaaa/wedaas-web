<template>
	<div>
		<el-dialog v-model="dialogVisible" title="联系人信息" @open="getExpireInfo" width="640px" class="expire common-dialog">
			<div class="content-body">
				<div class="info-item">
					<span class="key">创建人:</span>
					<span class="value">admin</span>
				</div>
				<div class="info-item">
					<span class="key">创建人邮箱:</span>
					<span class="value">admin@163.com</span>
				</div>
			</div>
			<template #footer>
				<el-button type="primary" @click="copyTextToClipboard('admin@163.com', '邮箱')"> 复制 </el-button>
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
import { copyTextToClipboard } from "@/utils/common";

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
	padding: 0 30px;
	// padding-left: 0;
	// height: 120px;
	padding-bottom: 0;
	background-color: #fff;
	.info-item {
		font-size: 13px;
		line-height: 25px;
		color: grey;
		.key {
			display: inline-block;
			width: 90px;
			color: #2c2f34;
		}
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
