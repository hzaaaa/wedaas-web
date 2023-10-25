<template>
	<el-dialog
		v-model="dialogVisible"
		title="编辑有效期"
		@close="closeResetDrawer"
		class="validDate-dialog"
		width="780px"
		style="height: 544px"
	>
		<el-form :model="dialogProps" ref="expirationTimeFormRef" :rules="expirationTimeFormRules" hide-required-asterisk>
			<el-form-item label="有效期" prop="expirationTime">
				<div class="datePicker-wrapper" style="margin-left: 10px; width: 352px">
					<el-date-picker
						v-model="dialogProps.expirationTime"
						type="daterange"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						format="YYYY-MM-DD"
						value-format="YYYY-MM-DD"
						class="date-picker"
					></el-date-picker>
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="dialogVisible = false">取消</el-button>
			<el-button type="primary" @click="editValidDate(expirationTimeFormRef)">确定</el-button>
			<!-- <el-button @click="check">check</el-button> -->
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import { editOrgExpirationDate } from "@/api/modules/systemManage/authorityCenter";
import { FormInstance, FormRules } from "element-plus";

const dialogVisible = ref(false);
interface DialogProps {
	expirationTime: any;
	id: number;
	// api?: (params: any) => Promise<any>;
}

const dialogProps = ref<DialogProps>({
	expirationTime: "",
	id: 0,
});

const acceptParams = (params: DialogProps) => {
	if (params.expirationTime) {
		params.expirationTime = params.expirationTime.split(" 至 ");
	}
	console.log(params);
	dialogProps.value = params;
	console.log(dialogProps.value.expirationTime);
	dialogVisible.value = true;
};
const expirationTimeFormRef = ref<FormInstance>();
const expirationTimeFormRules = reactive<FormRules>({
	expirationTime: [{ required: true, message: "请选择有效期！", trigger: "change" }],
	// ipList: [{required: true, message: "请填写授权IP！", trigger: "change"}]
});

const buttonLoading = ref(false);
const editValidDate = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;

	formEl.validate(async (valid) => {
		if (!valid) {
			ElMessage({
				type: "error",
				message: "请选择有效期！",
			});
			return;
		}

		buttonLoading.value = true;
		try {
			const params = {
				organizationId: dialogProps.value.id,
				expirationStart: dialogProps.value.expirationTime[0],
				expirationEnd: dialogProps.value.expirationTime[1],
			};
			await editOrgExpirationDate(params);

			ElMessage.success("编辑有效期成功");
			dialogVisible.value = false;
			emit("refreshData");
		} catch (err) {
			console.log(err);
			// ElNotification({
			//   title: "评估失败！",
			//   message: "评估失败！",
			//   type: "error",
			// });
			// ElMessage.error("操作错误");
			// getToken();
		} finally {
			buttonLoading.value = false;
		}
	});
};

const check = () => {
	console.log(dialogProps.value.expirationTime);
};
const closeResetDrawer = () => {
	expirationTimeFormRef.value?.clearValidate();
};
const emit = defineEmits(["refreshData"]);
defineExpose({
	acceptParams,
});
</script>

<style lang="scss">
.el-dialog.validDate-dialog {
	border-radius: 10px;
	box-shadow: 0 8px 20px 1px rgb(177 197 197 / 8%);
	.el-dialog__header {
		margin-right: 0;
		padding: 30px 28px 0;
		.el-dialog__title {
			font-family: PingFangSC-Regular-, PingFangSC-Regular;
			font-weight: normal;
			font-size: 24px;
			color: #303133;
		}
		.el-dialog__headerbtn {
			top: 16px;
		}
	}
	.el-dialog__body {
		padding-left: 81px;
		padding-top: 36px;
		span {
			display: inline-block;
			font-family: PingFangSC-Regular-, PingFangSC-Regular;
			font-weight: normal;
			font-size: 14px;
			color: #606266;
		}
	}
	.el-dialog__footer {
		position: absolute;
		right: 27px;
		bottom: 29px;
		padding: 0;
		.el-button {
			width: 70px;
			height: 32px;
		}
	}
}
</style>
