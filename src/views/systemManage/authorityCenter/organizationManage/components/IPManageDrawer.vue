<template>
	<el-drawer v-model="drawerVisible" title="IP编辑" :close-on-click-modal="false" @open="getOrgIpList">
		<el-form ref="IPManageFormRef" :model="drawerProps" :rules="IPManageFormRules">
			<!-- <el-form-item
					label="授权IP："
					label-width="100%"
					v-for="(authorityIP, index) in drawerProps.row!.authorityIPList"
					:key="authorityIP.id"
          :prop="'authorityIPList.' + index + '.value'"
				> -->
			<div class="table-main">
				<el-table :data="drawerProps.ipList" cell-class-name="table-cell" header-cell-class-name="header-cell" border>
					<el-table-column label="IP地址" prop="ip">
						<template #default="scope">
							<el-form-item :prop="'ipList.' + scope.$index + '.ip'" :rules="IPManageFormRules.ip">
								<el-input v-model="scope.row.ip"></el-input
							></el-form-item>
						</template>
					</el-table-column>
					<el-table-column label="备注" prop="remark">
						<template #default="scope">
							<el-form-item :prop="'ipList.' + scope.$index + '.remark'">
								<el-input v-model="scope.row.remark"></el-input
							></el-form-item>
						</template>
					</el-table-column>

					<el-table-column label="操作">
						<template #default="scope">
							<el-button type="primary" link @click="handleDeleteTableRow(scope.row)" v-if="scope.$index != 0">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-button type="primary" @click="handleAddTableRow">新增</el-button>

				<!-- </el-form-item> -->
			</div>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" @click="submit(IPManageFormRef)">提交</el-button>
			<!-- <el-button @click="check">check</el-button> -->
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { FormInstance, FormRules, ElMessage } from "element-plus";
import { getOrgIpListApi, editOrgIpListApi } from "@/api/modules/systemManage/authorityCenter";
import { validateIPAddress } from "@/utils/validator";
interface DrawerProps {
	id?: any;
	ipList?: Array<any>;
	// api?: (params: any) => Promise<any>;
}
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
	ipList: [],
});

const acceptParams = (params: DrawerProps) => {
	drawerProps.value = params;
	console.log(drawerProps.value);
	drawerVisible.value = true;
};

const ipList = ref<any>([]);
const IPManageFormRef = ref<FormInstance>();
const IPManageFormRules = reactive<FormRules>({
	ip: [{ required: true, validator: validateIPAddress, trigger: "blur" }],
	// ipList: [{required: true, message: "请填写授权IP！", trigger: "change"}]
});
// 获取组织ipList
const getOrgIpList = async () => {
	try {
		if (drawerProps.value) {
			let params: any = { organizationId: drawerProps.value.id };
			const { data } = await getOrgIpListApi(params);
			drawerProps.value.ipList = data;
		}
	} catch (err) {
		console.log(err);
	}
};

// 增加授权IP表行
const handleAddTableRow = () => {
	const row = {
		ip: "",
		remark: "",
	};
	ipList.value.push(row);
};

// 删除授权IP行
const handleDeleteTableRow = (row: any) => {
	const itemIndex = ipList.value.findIndex((element: any) => {
		element.ip == row.ip;
	});
	console.log(itemIndex);
	ipList.value.splice(itemIndex, 1);
};

// 提交
const buttonLoading = ref(false);
const submit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(async (valid) => {
		if (!valid) {
			ElMessage({
				type: "error",
				message: "请填入必要的信息！",
			});
			return;
		}

		buttonLoading.value = true;
		try {
			const params = {
				organizationId: drawerProps.value.id,
				list: buildIpListParams(ipList.value),
			};
			await editOrgIpListApi(params);
			drawerVisible.value = false;
			emit("refreshData");
			ElMessage.success("修改成功");
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

const buildIpListParams = (ipList: Array<any>) => {
	ipList.forEach((item) => {
		delete item.id;
	});
	return ipList;
};

const check = () => {
	console.log(ipList.value);
};

const emit = defineEmits(["refreshData"]);
defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped></style>
