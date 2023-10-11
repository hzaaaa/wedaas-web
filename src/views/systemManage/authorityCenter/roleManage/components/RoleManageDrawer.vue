<template>
	<el-drawer
		v-model="drawerVisible"
		:title="`${drawerProps.title}`"
		:close-on-click-modal="false"
		@open="getMenuTree"
		@close="resetMenuTreeData"
		:size="640"
	>
		<div id="drawer-wrapper" ref="wrapper">
			<el-form
				ref="roleManageFormRef"
				:model="drawerProps.row"
				:rules="roleManageFormRules"
				label-width="82px"
				v-if="!drawerProps.isView"
			>
				<el-form-item label="角色名称" prop="name">
					<el-input v-model="drawerProps.row!.name"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="description">
					<el-input v-model="drawerProps.row!.description" type="textarea" maxlength="500" :rows="4" show-word-limit></el-input>
				</el-form-item>

				<el-form-item label="角色权限" required>
					<MenuAuthTree
						:data="menuTreeShowData"
						:originData="originMenuTreeData"
						label="name"
						:allMenuTreeIdList="allMenuTreeIdList"
						:default-value="defaultSelected"
						ref="menuAuthTreeRef"
					/>
				</el-form-item>
			</el-form>
			<div v-else style="display: flex; flex-direction: column" class="role-detail-block">
				<div class="role-info">
					<span>角色名称 </span><span>{{ viewForm.name }}</span>
				</div>
				<div class="role-info">
					<span>角色描述</span><span> {{ viewForm.description }}</span>
				</div>
				<div class="role-info">
					<span>创建人</span><span> {{ viewForm.createBy }}</span>
				</div>
				<div class="role-info">
					<span>更新时间</span><span> {{ viewForm.updateTime }}</span>
				</div>

				<div style="display: flex">
					<span style="font-size: 14px; color: #606266">角色权限</span>
					<MenuAuthTree
						:data="menuTreeShowData"
						:originData="originMenuTreeData"
						label="name"
						:allMenuTreeIdList="allMenuTreeIdList"
						:defaultValue="defaultSelected"
						:isView="drawerProps.isView"
						ref="menuAuthTreeRef"
					/>
				</div>
			</div>
		</div>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" @click="submit(roleManageFormRef)" v-if="!drawerProps.isView">提交</el-button>
			<!-- <el-button @click="check">check</el-button> -->
			<!-- <el-button @click="backToTop">top</el-button> -->
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { FormInstance, FormRules } from "element-plus";
import MenuAuthTree from "./MenuAuthTree.vue";
import { getMenuTreeApi } from "@/api/modules/systemManage/authorityCenter";
import { SystemManage } from "@/api/interface/index";
import { validateRoleName } from "@/utils/validator";
import { ElMessage } from "element-plus";

interface DrawerProps {
	title: string;
	isView: boolean;
	row: any;
	api?: (params: any) => Promise<any>;
	renderApi?: (params: any) => Promise<any> | null;
}
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
	// isView: false,
	title: "",
	isView: false,
	row: {},
});

const acceptParams = (params: DrawerProps) => {
	drawerProps.value = params;
	drawerVisible.value = true;
};

const roleManageFormRef = ref<FormInstance>();
const roleManageFormRules = reactive<FormRules>({
	name: [{ required: true, validator: validateRoleName, trigger: "blur" }],
});

const menuAuthTreeRef = ref<InstanceType<typeof MenuAuthTree> | null>(null);
const menuTreeShowData = ref<any>([]);
const originMenuTreeData = ref<any>([]);
const allMenuTreeIdList = ref<number[]>([]);
const defaultSelected = ref([]);

// 查看详情
interface ViewFormProp {
	name: string;
	description: string;
	createBy: string;
	updateTime: string;
}
const viewForm = ref<ViewFormProp>({
	name: "",
	description: "",
	createBy: "",
	updateTime: "",
});

const getMenuTree = async () => {
	try {
		const { data } = await getMenuTreeApi();
		// if(data[0].childrenList) {
		originMenuTreeData.value = data;
		menuTreeShowData.value = getShowMenuTree(data);
		// }
		console.log(drawerProps.value.renderApi);
		console.log(drawerProps.value.title);
		if (drawerProps.value.renderApi) {
			if (drawerProps.value.title === "编辑") {
				const params = {
					roleId: drawerProps.value.row.id,
				};
				const { data } = await drawerProps.value.renderApi!(params);
				defaultSelected.value = data;
			} else {
				const { data } = await drawerProps.value.renderApi!(drawerProps.value.row.id);
				// console.log(data);
				viewForm.value = data;
				console.log(viewForm.value);
				menuAuthTreeDisabled(menuTreeShowData.value);
				console.error(data.menuList);
				defaultSelected.value = data.menuList;
			}
		}
		console.log(menuTreeShowData.value);
	} catch (err) {
		console.log(err);
	}
};

// 过滤隐藏菜单
const getShowMenuTree = (menuTreeData: SystemManage.AuthorityCenter.Menu.ResMenuTree[]) => {
	let newMenuTreeData: SystemManage.AuthorityCenter.Menu.ResMenuTree[] = JSON.parse(JSON.stringify(menuTreeData));
	return newMenuTreeData.filter((item) => {
		// if (item.childrenList?.length) {
		// item.childrenList.forEach((value) => {
		// if (value.type == 6 && !value.hidden) {
		//   if (!item.auth?.length) {
		//     item["auth"] = [];
		//   }
		//   item.auth?.push(value);
		//   allAuthIdList.value.push(value.id);
		// } else if (value.type == 6 && value.hidden) {
		//   defaultAuthId.value.push(value.id);
		// }
		// });
		// item.childrenList = item.childrenList.filter((value) => {
		//   return value.type != 6;
		// });
		// }
		item.childrenList?.length && (item.childrenList = getShowMenuTree(item.childrenList));
		// ** 获取所有menutree的节点id
		if (!item.hidden) {
			allMenuTreeIdList.value.push(item.id);
		}
		return !item.hidden;
	});
};

const menuAuthTreeDisabled = (menuTreeData: SystemManage.AuthorityCenter.Menu.ResMenuTree[]) => {
	menuTreeData.forEach((item: any) => {
		item["disabled"] = true;
		if (item.childrenList?.length) menuAuthTreeDisabled(item.childrenList);
	});
};

const buttonLoading = ref(false);
const submit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	console.log(menuAuthTreeRef.value?.choosenRouterAuthIdList!.length);
	if (menuAuthTreeRef.value?.choosenRouterAuthIdList!.length == 0) {
		ElMessage({
			type: "error",
			message: "至少勾选一个权限！",
		});
		return;
	}
	formEl.validate(async (valid) => {
		if (!valid) {
			ElMessage({
				type: "error",
				message: "请填入必要的信息！",
			});
			return;
		}
		if (valid && menuAuthTreeRef.value?.choosenRouterAuthIdList!.length) {
			buttonLoading.value = true;
			try {
				drawerProps.value.row["menuIdList"] = menuAuthTreeRef.value?.choosenRouterAuthIdList;
				console.log();
				await drawerProps.value.api!(drawerProps.value.row);
				drawerVisible.value = false;
				ElMessage.success(`${drawerProps.value.title}角色${drawerProps.value.row.name}成功`);
				emit("refreshData");
			} catch (err) {
				console.log(err);
				// ElNotification({
				//   title: "评估失败！",
				//   message: "评估失败！",
				//   type: "error",
				// });
				// ElMessage.error("操作失败");
				// getToken();
			} finally {
				buttonLoading.value = false;
			}
		}
	});

	// try {
	// 	drawerProps.value.row["menuIdList"] = menuAuthTreeRef.value?.choosenRouterAuthIdList;
	// 	console.log();
	// 	await drawerProps.value.api!(drawerProps.value.row);
	// 	drawerVisible.value = false;
	// 	emit("refreshData");
	// } catch (err) {
	// 	console.log(err);
	// }
};

const resetMenuTreeData = () => {
	menuTreeShowData.value = [];
	originMenuTreeData.value = [];
	allMenuTreeIdList.value = [];
	defaultSelected.value = [];
	// console.log(menuAuthTreeRef.value?.scroll.wrap)
};

const check = () => {
	console.log(drawerProps.value.row);
	console.log(menuAuthTreeRef.value?.choosenRouterAuthIdList);
	console.log(menuAuthTreeRef.value?.authIdToPermisson);
	console.log(menuAuthTreeRef.value?.authToHiddenRouter);
	console.log(defaultSelected.value);
};
// const wrapper = ref();
// const backToTop = () => {
//   // let ele = document.getElementById("drawer-wrapper")
// 	// console.log(ele)
// 	// 	if(ele) {
// 	// 		ele.scrollTop = 0;
// 	// 	}
//   wrapper.value.scrollTop = 0

// }

const emit = defineEmits(["refreshData"]);

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped>
.role-detail-block {
	div {
		margin-bottom: 14px;
	}
	.role-info {
		span {
			display: inline-block;
			text-align: right;
			font-family: PingFangSC-Regular-, PingFangSC-Regular;
			font-weight: normal;
			font-size: 14px;
			&:first-of-type {
				width: 56px;
				color: #606266;
			}
			&:nth-of-type(2) {
				margin-left: 30px;
				color: #303133;
			}
		}
	}
}
</style>
