<template>
	<el-dialog title="SQL语句" class="sql-edit-dialog" v-model="dialogVisible">
		<el-form :model="dialogProps" ref="editSQlFormRef" hide-required-asterisk v-if="userSessionStore.behaviorGet == 'edit'">
			<el-form-item>
				<el-input v-model="dialogProps.info" :autosize="{ minRows: 4 }" type="textarea"></el-input>
			</el-form-item>
		</el-form>
		<el-input v-model="dialogProps.info" v-if="userSessionStore.behaviorGet == 'view'" disabled></el-input>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false" v-if="userSessionStore.behaviorGet == 'edit'"> 保存 </el-button>
				<el-button type="primary" @click="copyTextToClipboard(dialogProps!.info)" v-if="userSessionStore.behaviorGet == 'view'">
					复制
				</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import {} from "vue";
import { FormInstance, FormRules } from "element-plus";
import { useUserStoreSessionStorage } from "@/stores/user";
import { copyTextToClipboard } from "@/utils/util";

const dialogVisible = ref(false);
const userSessionStore = useUserStoreSessionStorage();

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

const editSQlFormRef = ref<FormInstance>();

// const editSQlForm = reactive({
// 	email: userStore.userInfoGet.email,
// 	oldPwd: "",
// 	newPwd: "",
// 	confirmPwd: "",
// });

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped></style>
