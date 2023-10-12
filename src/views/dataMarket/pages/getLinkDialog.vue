<template>
	<div>
		<el-dialog
			v-model="dialogVisible"
			title=" "
			@open="getExpireInfo"
			width="1100px"
			style="height: 350px"
			class="expire common-dialog"
		>
			<el-tabs class="full-content-tabs" v-model="activeTab">
				<el-tab-pane label="请求参数" name="请求参数"></el-tab-pane>
				<el-tab-pane label="分页参数" name="分页参数"></el-tab-pane>
			</el-tabs>
			<template #footer>
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="submit"> 生成API链接 </el-button>
				<!-- <el-button @click="check">check</el-button> -->
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";

const activeTab = ref("请求参数");
const dialogVisible = ref(true);

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
</style>
