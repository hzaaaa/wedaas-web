<template>
	<el-drawer v-model="drawerVisible" :title="`${drawerProps.title}`" :close-on-click-modal="false" @close="closeResetDrawer">
		<!-- @open="getpartnerList" -->
		<el-form ref="orgFormRef" :model="drawerProps.row" :rules="orgFormRules" label-width="80px">
			<el-form-item label="合作方" prop="partnerId">
				<el-select
					v-model="drawerProps.row!.partnerId"
					placeholder=""
					clearable
					@change="partnerSelectorChange"
					ref="partnerSeletorRef"
				>
					<el-option
						v-for="options in partnerList"
						:key="options.id"
						:label="options.name"
						:value="options.id"
						:disabled="options.disabled"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="组织名称" prop="name">
				<el-input v-model="drawerProps.row!.name"></el-input>
			</el-form-item>
			<el-form-item label="组织描述" prop="description">
				<el-input v-model="drawerProps.row!.description" type="textarea" :rows="3" maxlength="500" show-word-limit></el-input>
			</el-form-item>
			<div class="edit-forbidden-block" v-if="!drawerProps.isEdit">
				<el-form-item label="有效期" prop="expirationTime">
					<el-date-picker
						v-model="drawerProps.row!.expirationTime"
						type="daterange"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						format="YYYY-MM-DD"
						value-format="YYYY-MM-DD"
					></el-date-picker>
				</el-form-item>
				<!-- <el-form-item
					label="授权IP："
					label-width="100%"
					v-for="(authorityIP, index) in drawerProps.row!.authorityIPList"
					:key="authorityIP.id"
          :prop="'authorityIPList.' + index + '.value'"
				> -->

				<!-- v1先不做 -->
				<!-- <div class="table-main">
					<el-table :data="drawerProps.row!.ipList" cell-class-name="table-cell" header-cell-class-name="header-cell" border>
						<el-table-column label="IP地址" prop="ip">
							<template #default="scope">
								<el-form-item :prop="'ipList.' + scope.$index + '.ip'" :rules="orgFormRules.ip">
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
				</div> -->

				<!-- </el-form-item> -->
			</div>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" @click="submit(orgFormRef)">提交</el-button>
			<!-- <el-button @click="check">check</el-button> -->
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from "vue";
import { ElMessage, FormInstance, FormRules } from "element-plus";

import { getOrganizationPartnerApi, addOrganizationApi, editOrganizationApi } from "@/api/modules/systemManage/authorityCenter";
// import { SystemManage } from "@/api/interface/index";
import { validateOrgName, validateOrgDescription, validateIPAddress } from "@/utils/validator";

interface DrawerProps {
	title: string;
	isEdit: boolean;
	row: any;
	api?: (params: any) => Promise<any>;
}
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
	// isView: false,
	title: "",
	isEdit: false,
	row: {},
});

const acceptParams = (params: DrawerProps) => {
	drawerProps.value = params;
	// if(drawerProps.value.row.expirationTime) {
	// 	drawerProps.value.row.expirationTime = drawerProps.value.row.expirationTime.split(" 至 ")
	// }
	// drawerProps.value.row.ipList = [
	// 	{
	// 		ip: "",
	// 		remark: "",
	// 	},
	// ];
	drawerVisible.value = true;
};

const partnerSeletorRef = ref();
const orgFormRef = ref<FormInstance>();
const orgFormRules = reactive<FormRules>({
	description: [{ required: true, validator: validateOrgDescription, trigger: "blur" }],
	name: [{ required: true, validator: validateOrgName, trigger: "blur" }],
	partnerId: [{ required: true, message: "请选择合作方！", trigger: "change" }],
	expirationTime: [{ required: true, message: "请选择有效期！", trigger: "change" }],
	// ip: [{ required: true, validator: validateIPAddress, trigger: "blur" }],
	// ipList: [{required: true, message: "请填写授权IP！", trigger: "change"}]
});
// const partnerListLoading = ref(false);
const partnerList = ref<{ [key: string]: any }[]>([]);
const orgPartnerList = ref([]);

// 获取合作方选择框列表
// const getpartnerList = async () => {
// 	try {
// 		const partnerSelector = <any>await getPartnerSelectorApi("", true);
// 		partnerList.value = partnerSelector.data;
// 		const { data } = await getOrganizationPartnerApi();
// 		orgPartnerList.value = data;
// 		console.log(orgPartnerList.value);
// 		partnerList.value.forEach((item: any) => {
// 			const findItem = orgPartnerList.value.find((element: any) => element == item.id);
// 			if (findItem) {
// 				item["disabled"] = true;
// 			}
// 		});
// 		console.log(partnerList.value);
// 	} catch (err) {
// 		console.log(err);
// 	} finally {
// 		if (drawerProps.value.row.partnerId) partnerSelectorChange(drawerProps.value.row.partnerId);
// 	}
// };

const partnerSelectorChange = (val: any) => {
	console.log(val);
	let partnerSelected = partnerList.value.find((item: any) => item.id == val);
	if (partnerSelected) {
		drawerProps.value.row["partnerName"] = partnerSelected.name;
		// drawerProps.value.row["accessId"] = partnerSelected.accessId;
	}
};

// 增加授权IP表行
const handleAddTableRow = () => {
	const row = {
		ip: "",
		remark: "",
	};
	drawerProps.value.row.ipList.push(row);
};

// 删除授权IP行
const handleDeleteTableRow = (row: any) => {
	const itemIndex = drawerProps.value.row.ipList.findIndex((element: any) => {
		element.ip == row.ip;
	});
	console.log(itemIndex);
	drawerProps.value.row.ipList.splice(itemIndex, 1);
};

const buttonLoading = ref(false);
const submit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	// if() {

	// }
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
			if (!drawerProps.value.isEdit && drawerProps.value.row.expirationTime) {
				drawerProps.value.row["expirationStart"] = drawerProps.value.row.expirationTime[0];
				drawerProps.value.row["expirationEnd"] = drawerProps.value.row.expirationTime[1];
				delete drawerProps.value.row.expirationTime;
				console.log(drawerProps.value.row);

				await addOrganizationApi(drawerProps.value.row);
				ElMessage.success("创建组织成功");
				drawerVisible.value = false;
				emit("refreshData");
			} else {
				let params = {
					organizationId: drawerProps.value.row.id,
					name: drawerProps.value.row.name,
					partnerId: drawerProps.value.row.partnerId,
					description: drawerProps.value.row.description,
					// accessId: drawerProps.value.row.accessId,
					partnerName: drawerProps.value.row.partnerName,
				};
				console.log(params);

				await editOrganizationApi(params);
				ElMessage.success("编辑组织成功");
				drawerVisible.value = false;
				emit("refreshData");
			}
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

const closeResetDrawer = () => {
	orgFormRef.value?.resetFields();
	orgFormRef.value?.clearValidate();
};
const check = () => {
	console.log(drawerProps.value.row);
	nextTick(() => {
		console.log();
	});
};

const emit = defineEmits(["refreshData"]);

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped></style>
