<template>
	<el-dialog title="关于我们" class="about-us-dialog" v-model="dialogVisible">
		<div class="about-us-info-wrapper">
			<div class="info-item"><span>版本 :</span><span>微言DaaS 4.0.2</span></div>
			<div class="info-item"><span>Java版本 :</span><span>1.8</span></div>
			<div class="info-item"><span>服务器时间 :</span><span>2023-10-24 11:31:59 中国标准时间 (CST)</span></div>
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
defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped>
.el-dialog.about-us-dialog {
	.about-us-info-wrapper {
		display: flex;
		flex-direction: column;
		.info-item {
			display: flex;
			justify-content: space-between;
		}
	}
}
</style>
