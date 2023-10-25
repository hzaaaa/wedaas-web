<template>
	<div class="menu-tree">
		<!-- <el-button @click="check">查看</el-button> -->

		<el-checkbox label="全部" size="large" v-model="allChecked" @change="allCheckedChange" v-if="!props.isView" />

		<el-tree
			ref="treeRef"
			default-expand-all
			:node-key="id"
			:data="treeAllData"
			:show-checkbox="multiple"
			:check-strictly="false"
			:current-node-key="''"
			:highlight-current="!multiple"
			:expand-on-click-node="false"
			:check-on-click-node="multiple"
			:props="defaultProps"
			@check="handleCheck"
		>
			<template #default="scope">
				<span class="el-tree-node__label">
					<slot :row="scope">
						{{ scope.node.label }}
					</slot>
				</span>
			</template>
		</el-tree>
	</div>
</template>

<script setup lang="ts" name="TreeFilter">
import { ref, watch, onBeforeMount, nextTick, reactive, computed } from "vue";
import { ElTree } from "element-plus";
import { SystemManage } from "@/api/interface/index";

// 接收父组件参数并设置默认值
interface MenuAuthTreeProps {
	requestApi?: (data?: any) => Promise<any>; // 请求分类数据的 api ==> 非必传
	id?: string; // 选择的id ==> 非必传，默认为 “id”
	label?: string; // 显示的label ==> 非必传，默认为 “label”
	multiple?: boolean; // 是否为多选 ==> 非必传，默认为 true
	defaultValue?: any; // 默认选中的值 ==> 非必传
	data?: { [key: string]: any }[]; // 分类数据，如果有分类数据，则不会执行 api 请求 ==> 非必传
	originData?: SystemManage.AuthorityCenter.Menu.ResMenuTree[]; // 分类数据，如果有分类数据，则不会执行 api 请求 ==> 非必传
	allMenuTreeIdList: Array<number>;
	isView?: boolean;
}
const props = withDefaults(defineProps<MenuAuthTreeProps>(), {
	id: "id",
	label: "label",
	multiple: true,
});

const defaultProps = {
	children: "childrenList",
	label: props.label,
};

// 滚动条
const scrollRef = ref();

const treeRef = ref<InstanceType<typeof ElTree>>();
const treeAllData = ref<any>([]);

const selected = ref();
const setSelected = () => {
	if (props.multiple) selected.value = Array.isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue];
	console.log(selected.value);
	selected.value.forEach((item: any) => {
		treeRef.value?.setChecked(item, true, false);
	});
	// else selected.value = typeof props.defaultValue === "string" ? props.defaultValue : "";
};

// 全选ckeckbox
const allChecked = ref(false);
// ** 隐藏路由页面与对应的权限页面的对象 string:number
const authToHiddenRouter = reactive<any>({});
// ** 权限id 对应的 权限 number ： string
const authIdToPermisson = reactive<any>({});
// ** 隐藏路由页面array
const hiddenRouter = ref<any>([]);
// ** 所有选择路由权限id列表
const choosenRouterAuthIdList = computed(() => {
	const idList = treeRef.value?.getCheckedKeys().concat(treeRef.value.getHalfCheckedKeys()).concat(hiddenRouter.value);
	return idList;
});

// 全选
const allCheckedChange = () => {
	// console.log(allChecked.value);
	if (allChecked.value) {
		treeRef.value?.setCheckedNodes(treeAllData.value);
		// handleCheck("");
		// choosenAuth.value = allAuthIdList.value;
		// allAuthIdList.value.forEach((authId) => {
		//   choosenAuth.value.push(authId);
		// });
		// choosenMenu.value = treeRef.value?.getCheckedKeys();
	} else {
		treeRef.value?.setCheckedNodes([]);
		// choosenAuth.value = [];
		// choosenMenu.value = [];
	}
	const checkedNodeIdList = treeRef.value?.getCheckedKeys().concat(treeRef.value.getHalfCheckedKeys());
	hiddenRouterChange(checkedNodeIdList);
};

// ** 选择的菜单和权限选中的数量
const choosenMenuAuthNum = computed(() => {
	let choosenNum = treeRef.value?.getCheckedKeys().concat(treeRef.value.getHalfCheckedKeys()).length;
	return choosenNum;
});

// ** 权限对应隐藏路由页面id && 权限id对应权限名称
const getAuthToHiddenRouter = (originMenuTreeData: SystemManage.AuthorityCenter.Menu.ResMenuTree[]) => {
	// console.log(originMenuTreeData);
	originMenuTreeData.forEach((item) => {
		if (item.hidden && item.type != 6 && item.permission && item.redirect) {
			// console.log(item);
			let arr = item.permission.split(",");
			// console.log(arr);
			arr.forEach((element) => {
				if (authToHiddenRouter[element]) {
					console.log(authToHiddenRouter[element]);
					// authToHiddenRouter[element] = Array.from(authToHiddenRouter[element]).push(item.id);
					if (Array.isArray(authToHiddenRouter[element])) {
						authToHiddenRouter[element].push(item.id);
					} else {
						authToHiddenRouter[element] = Array(1).fill(authToHiddenRouter[element]);
						authToHiddenRouter[element].push(item.id);
					}
				} else {
					authToHiddenRouter[element] = item.id;
				}
			});
		}

		if (item.type == 6 && item.permission) {
			authIdToPermisson[item.id] = item.permission;
		}

		if (item.childrenList?.length) {
			getAuthToHiddenRouter(item.childrenList);
		}
	});
};

// * 复选框点击触发
const handleCheck = (checkNode: any, treecheckedNode: any) => {
	console.log(checkNode);
	console.log(treecheckedNode);
	const checkedNodeIdList = treecheckedNode.checkedKeys.concat(treecheckedNode.halfCheckedKeys);
	hiddenRouterChange(checkedNodeIdList);
};
// node变化触发hiddenRouter改变
const hiddenRouterChange = (nodeIdList: any) => {
	hiddenRouter.value = [];
	nodeIdList.forEach((item: any) => {
		// console.log(authIdToPermisson[item]); // id 对应的权限名称
		let authName = authIdToPermisson[item];
		if (authToHiddenRouter[authName]) {
			hiddenRouter.value.push(authToHiddenRouter[authName]);
		}
	});
	hiddenRouter.value = hiddenRouter.value.flat();
	console.log(hiddenRouter.value);
	hiddenRouter.value = noRepeat(hiddenRouter.value);
};

const noRepeat = (arr: any[]) => {
	let newArr = [...new Set(arr)];
	return newArr;
};

const check = () => {
	// console.warn(authToHiddenRouter);
	// console.error(authIdToPermisson);
	// console.log(hiddenRouter.value);
	console.warn(choosenRouterAuthIdList.value);
};

onBeforeMount(async () => {
	setSelected();
	if (props.requestApi) {
		const { data } = await props.requestApi!();
		treeAllData.value = [{ id: "", [props.label]: "全部" }, ...data];
	}
});

// 使用 nextTick 防止打包后赋值不生效，开发环境是正常的
watch(
	() => props.defaultValue,
	() => nextTick(() => setSelected()),
	{ deep: true, immediate: true }
);

watch(
	() => props.data,
	() => {
		if (props.data?.length) {
			// treeData.value = props.data;
			treeAllData.value = [...props.data];
		}
		if (props.originData?.length) {
			getAuthToHiddenRouter(props.originData);
		}
	},
	{ deep: true, immediate: true }
);

watch(
	() => choosenMenuAuthNum.value,
	(newVal) => {
		if (newVal == props.allMenuTreeIdList?.length) {
			allChecked.value = true;
		} else {
			allChecked.value = false;
		}
	},
	{
		deep: true,
	}
);
// const filterText = ref("");
// watch(filterText, (val) => {
// 	treeRef.value!.filter(val);
// });

// interface FilterEmits {
// 	(e: "change", value: any): void;
// }
// const emit = defineEmits<FilterEmits>();

// // 单选
// const handleNodeClick = (data: { [key: string]: any }) => {
// 	if (props.multiple) return;
// 	emit("change", data[props.id]);
// };

// // 多选
// const handleCheckChange = () => {
// 	emit("change", treeRef.value?.getCheckedKeys());
// };

// 暴露给父组件使用
defineExpose({ treeAllData, treeRef, choosenRouterAuthIdList, scrollRef, authToHiddenRouter, authIdToPermisson });
</script>

<style scoped lang="scss">
// .is-disabled{
// 	 &+ span{
// color: #606266;
// 	}
// }
.el-checkbox {
	height: 32px;
}
</style>
