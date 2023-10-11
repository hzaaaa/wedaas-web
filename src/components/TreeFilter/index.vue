<template>
	<div class="filter">
		<div v-if="title" class="title sle">
			<span> {{ title }}</span>
		</div>
		<el-scrollbar>
			<el-tree
				ref="treeRef"
				default-expand-all
				:node-key="id"
				:data="multiple ? treeData : treeAllData"
				:show-checkbox="multiple"
				:check-strictly="false"
				:current-node-key="!multiple ? selected : ''"
				:props="defaultProps"
				:highlight-current="!multiple"
				:expand-on-click-node="false"
				:check-on-click-node="multiple"
				:default-checked-keys="multiple ? selected : []"
				@node-click="handleNodeClick"
			>
				<template #default="scope">
					<span class="el-tree-node__label">
						<slot :row="scope">
							{{ scope.node.label }}
						</slot>
					</span>
				</template>
			</el-tree>
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch, nextTick } from "vue";
import { ElTree } from "element-plus";

// 接收父组件参数并设置默认值
interface TreeFilterProps {
	requestApi?: (data?: any) => Promise<any>; // 请求分类数据的 api ==> 非必传
	data?: { [key: string]: any }[]; // 分类数据，如果有分类数据，则不会执行 api 请求 ==> 非必传
	title?: string; // treeFilter 标题 ==> 非必传
	id?: string; // 选择的id ==> 非必传，默认为 “id”
	label?: string; // 显示的label ==> 非必传，默认为 “label”
	multiple?: boolean; // 是否为多选 ==> 非必传，默认为 false
	defaultValue?: any; // 默认选中的值 ==> 非必传
}
const props = withDefaults(defineProps<TreeFilterProps>(), {
	id: "id",
	label: "label",
	multiple: false,
});

const defaultProps = {
	children: "children",
	label: props.label,
};

const treeRef = ref<InstanceType<typeof ElTree>>();
const treeData = ref<{ [key: string]: any }[]>([]);
const treeAllData = ref<{ [key: string]: any }[]>([]);

const selected = ref();
const setSelected = () => {
	if (props.multiple) selected.value = Array.isArray(props.defaultValue) ? props.defaultValue : [props.defaultValue];
	else selected.value = typeof props.defaultValue === "number" ? props.defaultValue : "";
	console.warn(selected.value);
};

onBeforeMount(async () => {
	setSelected();
	if (props.requestApi) {
		const { data } = await props.requestApi!();
		treeData.value = data;
		treeAllData.value = [{ id: "", [props.label]: "全部" }, ...data];
	}
});

watch(
	() => props.data,
	() => {
		if (props.data?.length) {
			treeData.value = props.data;
			treeAllData.value = [...props.data];
			// treeAllData.value = [{ id: "", [props.label]: "全部" }, ...props.data];
		}
	},
	{ deep: true, immediate: true }
);

watch(
	() => props.defaultValue,
	() => nextTick(() => setSelected()),
	{ deep: true, immediate: true }
);

interface FilterEmits {
	(e: "change", value: any): void;
}

const emit = defineEmits<FilterEmits>();

const handleNodeClick = (data: { [key: string]: any }) => {
	console.log(data);
	if (props.multiple) return;
	emit("change", data[props.id]);
};
// 暴露给父组件使用
defineExpose({ treeData, treeAllData, treeRef });
</script>

<style lang="scss" scoped>
@import "./index";
</style>
