<template>
	<el-drawer
		ref="drawerMode"
		v-model="showDrawer"
		:before-close="isClose"
		:destroy-on-close="true"
		class="drawer-box"
		:show-close="false"
		:close-on-click-modal="false"
		direction="rtl"
	>
		<!-- 标题 -->
		<template #header="{ close }">
			<h4>{{ userStore.behaviorGet === "add" ? "新增" : "修改" }}</h4>
			<!-- <h4>{{ props.employeeRow.employee_id === '1' ? '修改' : '新增' }}员工信息</h4> -->
			<el-icon @click="close" :size="20">
				<Close />
			</el-icon>
		</template>

		<!-- 表单内容 -->
		<template #default>
			<div class="form_inner_box">
				<el-form ref="queryFormRef" :model="props.employeeRow" label-width="auto" :rules="rulesForm">
					<el-row>
						<el-col :span="24">
							<el-form-item label="用户" prop="dataBaseName">
								<el-input v-model="props.employeeRow.dataBaseName" placeholder="" clearable></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="24">
							<el-form-item label="密码" prop="pwd">
								<el-input v-model="props.employeeRow.pwd" type="password" placeholder="" clearable show-password></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="24">
							<el-form-item label="员工号" prop="follow">
								<el-input v-model="props.employeeRow.follow" type="number" placeholder="" clearable></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="24">
							<el-form-item label="姓名" prop="tableName">
								<el-input v-model="props.employeeRow.tableName" placeholder="" clearable></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="24">
							<el-form-item label="邮箱" prop="dataSourceName">
								<el-input v-model="props.employeeRow.dataSourceName" placeholder=" " clearable></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="24">
							<el-form-item label="备注" prop="desc">
								<el-input v-model="props.employeeRow.desc" placeholder=" " clearable></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="24">
							<el-form-item label="角色" prop="id">
								<el-select v-model="props.employeeRow.id" class="m-2" placeholder="Select" size="large">
									<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>

						<el-col :span="24">
							<el-form-item label="群组" prop="dataCatalog">
								<el-select v-model="props.employeeRow.dataCatalog" class="m-2" placeholder="Select" size="large">
									<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
		</template>

		<!-- 底部 -->
		<template #footer>
			<div class="drawer_footer">
				<el-button @click="isClose">取消</el-button>
				<el-button type="primary" v-loading="submitLoading" v-throttle="() => onSave(queryFormRef)">{{
					loading ? "保存中 ..." : "确定"
				}}</el-button>
			</div>
		</template>
	</el-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, getCurrentInstance, nextTick, toRef } from "vue";
import { useRouter } from "vue-router";
import { ElDrawer, ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { Close } from "@element-plus/icons-vue";
import { useUserStoreSessionStorage } from "@/stores/user";
import useDrawerhook from "@/hooks/drawerhook";
// import useFileUpLoadHook, { validateFile } from "@/hooks/fileUpLoadHook";

// import { addPartnerApi, editPartnerApi, getPartnerDetailsApi } from "@/api/biz/collaborators";

const userStore = useUserStoreSessionStorage();

const props = defineProps({
	employeeRow: {
		type: Object,
		default: {},
	},
});

const options = [
	{
		value: 1,
		label: "Option1",
	},
];
//#region 校验

// 手机号校验
const validatePhone1 = (rule: any, value: any, callback: any) => {
	const regexp = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
	if (rule.required) {
		if (value.trim() === "") {
			return callback();
		}

		if (!regexp.test(value)) {
			callback(new Error("请输入正确的手机号"));
		} else {
			callback();
		}
	} else {
		if (value.trim() === "") {
			return callback();
		} else {
			if (!regexp.test(value)) {
				callback(new Error("请输入正确的手机号"));
			} else {
				callback();
			}
		}
	}
};
const validatePhone2 = (rule: any, value: any, callback: any) => {
	const regexp = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
	if (rule.required) {
		if (value.trim() === "") {
			return callback();
		}

		if (!regexp.test(value)) {
			callback(new Error("请输入正确的手机号"));
		} else {
			callback();
		}
	} else {
		if (value.trim() === "") {
			return callback();
		} else {
			if (!regexp.test(value)) {
				callback(new Error("请输入正确的手机号"));
			} else {
				callback();
			}
		}
	}
};

const rulesForm = reactive<FormRules>({
	name: [{ required: true, message: "客户名称不能为空", trigger: "blur" }],
	// code: [{ required: true, message: "统一社会信用代码不能为空", trigger: "blur" }],
	// businessScope: [{ required: true, message: "经营范围不能为空", trigger: "blur" }],
	// description: [{ required: true, message: "合作方描述不能为空", trigger: "blur" }],
	// ourBdName: [{ required: true, message: "我方商务不能为空", trigger: "blur" }],
	ourBdTel: [
		// { required: true, message: "我方商务联系方式不能为空", trigger: "blur" },
		{ required: false, validator: validatePhone1, trigger: "blur" },
	],
	// partnerBdName: [{ required: true, message: "合作方商务联系人不能为空", trigger: "blur" }],
	partnerBdTel: [
		// { required: true, message: "合作方商务联系方式不能为空", trigger: "blur" },
		{ required: false, validator: validatePhone1, trigger: "blur" },
	],
	partnerArtisanTel: [{ required: false, validator: validatePhone2, trigger: "blur" }],
	// fileList: [{ required: true, message: "相关资质证书不能为空", trigger: "blur" }],
});
//#endregion
const submitLoading = ref(false);
const onSave = async (formEl: FormInstance | undefined) => {
	// 添加
	// if (userStore.behavior !== "modify") {
	// 	if (!formEl) return;
	// 	//
	// 	formEl.validate(async (valid, fields) => {
	// 		if (valid) {
	// 			let queyTempt = { ...props.employeeRow };
	// 			try {
	// 				submitLoading.value = true;
	// 				let data = await useFileUpLoadHook({ value: queyTempt.fileList });
	// 				queyTempt.fileList = data;
	// 				// if(!queyTempt.partnerArtisanTel){
	// 				// 	delete queyTempt.partnerArtisanTel
	// 				// }
	// 				// if(!queyTempt.partnerArtisanName){
	// 				// 	delete queyTempt.partnerArtisanName
	// 				// }
	// 				addPartnerApi(queyTempt).then((response: any) => {
	// 					if (response.code === 200) {
	// 						ElMessage.success("创建成功");
	// 						showDrawer.value = false;
	// 						loading.value = false;
	// 						emit("confirmFunc");
	// 					}
	// 				});
	// 			} catch (err: any) {
	// 				if (!err.msg) {
	// 					ElMessage.error(err);
	// 				}
	// 			} finally {
	// 				submitLoading.value = false;
	// 			}
	// 		} else {
	// 			console.log("error", fields);
	// 		}
	// 	});
	// } else {
	// 	// 修改
	// 	if (!formEl) return;
	// 	formEl.validate(async (valid, fields) => {
	// 		if (valid) {
	// 			let queyTempt = { ...props.employeeRow };
	// 			let rawList = queyTempt.fileList.filter((item: any) => {
	// 				return !!item.raw;
	// 			});
	// 			let uploadedList = queyTempt.fileList.filter((item: any) => {
	// 				return !!item.uploaded;
	// 			});
	// 			uploadedList = uploadedList.map((item: any) => {
	// 				return item.uploaded;
	// 			});
	// 			try {
	// 				submitLoading.value = true;
	// 				let data = await (<any>useFileUpLoadHook({ value: rawList }));
	// 				queyTempt.fileList = [...uploadedList, ...data];
	// 				// console.log(queyTempt.fileList);
	// 				delete queyTempt.createBy;
	// 				delete queyTempt.updateTime;
	// 				// if(!queyTempt.partnerArtisanTel){
	// 				// 	delete queyTempt.partnerArtisanTel
	// 				// }
	// 				// if(!queyTempt.partnerArtisanName){
	// 				// 	delete queyTempt.partnerArtisanName
	// 				// }
	// 				editPartnerApi(queyTempt).then((response: any) => {
	// 					if (response.code === 200) {
	// 						ElMessage.success("修改成功");
	// 						showDrawer.value = false;
	// 						loading.value = false;
	// 						emit("confirmFunc");
	// 					}
	// 				});
	// 			} catch (err: any) {
	// 				if (!err.msg) {
	// 					ElMessage.error(err);
	// 				}
	// 			} finally {
	// 				submitLoading.value = false;
	// 			}
	// 		} else {
	// 			console.log("error", fields);
	// 		}
	// 	});
	// }
};

let { showDrawer, timer, loading, queryFormRef, isOpen, isClose } = useDrawerhook(
	props,
	() => {
		if (userStore.behavior === "modify") {
			//fileList 转换
			// debugger;
			//已上传文件
			// props.employeeRow.fileList = props.employeeRow.fileList.map((item: any, index: any) => {
			// 	return {
			// 		name: item.sourceFileName,
			// 		uploaded: item, //已上传的信息
			// 		size: 0, //不会因大小被过滤
			// 		uid: item.sourceFileName + index, //不会因大小被过滤
			// 		// uid: 1, //不会因大小被过滤
			// 	};
			// });
			props.employeeRow.pwd = "123456";
		}
	},
	() => {}
);
const emit = defineEmits(["confirmFunc"]);
// 子组件有<script setup>	需要defineExpose暴露，方法方可使用
defineExpose({
	isOpen,
	isClose,
});
</script>
<style scoped lang="scss"></style>
