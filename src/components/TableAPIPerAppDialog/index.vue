<template>
	<el-dialog title="" class="table-per-app-dialog" v-model="dialogVisible">
		<el-form
			:model="tablePerAppForm"
			ref="tablePerAppFormRef"
			label-position="top"
			:rules="tablePerAppFormRules"
			require-asterisk-position="right"
		>
			<div class="table-info-detail">
				<span class="table-desc">描述</span>
				<div class="info-detail">
					<span>activity_sku</span>
					<div>
						<el-icon><Check /></el-icon>mysql
					</div>
					<div>
						<el-icon><Check /></el-icon>gmall
					</div>
					<div class="permission-raido">
						<el-radio-group v-model="tablePerAppForm.perType">
							<el-radio :label="0" size="small">查看</el-radio>
							<el-radio :label="1" size="small">全部</el-radio>
						</el-radio-group>
					</div>
				</div>
			</div>
			<div class="applicant-info"><span>用户名</span><span>xxx</span></div>
			<div class="applicant-info"><span>邮箱</span><span>12345@qq.com</span></div>
			<el-form-item label="申请原因" prop="perReason">
				<el-input v-model="tablePerAppForm.perReason" maxlength="300" show-word-limit type="textarea"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="dialogVisible = false"> 申请 </el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { FormInstance, FormRules } from "element-plus";
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

const tablePerAppFormRef = ref<FormInstance>();

const tablePerAppForm = reactive({
	perType: 0,
	perReason: "",
});

const tablePerAppFormRules = reactive<FormRules>({
	perReason: [{ required: true, message: "请填写申请原因", trigger: "blur" }],
});

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped>
@import "./index";
</style>
