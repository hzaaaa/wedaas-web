<template>
	<el-drawer
		v-model="drawerVisible"
		title="编辑数据权限"
		:close-on-click-modal="false"
		:size="640"
		@close="handleDrawerClose()"
		@open="handleDrawerOpen()"
		class="data-auth-drawer"
	>
		<!-- <div class="flex-box" style="flex-direction: column;"> -->
		<el-form :model="getDataAssetsFieldsParams">
			<el-form-item>
				<el-select
					v-model="getDataAssetsFieldsParams.dataType"
					placeholder=""
					@change="handleDataAssetsTypeChange"
					ref="dataAssetsTypeRef"
				>
					<el-option v-for="item in dataAssetsTypeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="getDataAssetsFieldsParams.type" placeholder="" @change="handleDataTypeChange" ref="dataTypeRef">
					<el-option v-for="item in dataTypeOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item>
			<!-- <el-form-item>
				<el-select v-model="getDataAssetsFieldsParams.dataId" placeholder="" @change="handleDataAssetsChange" ref="dataAssetsRef">
					<el-option v-for="item in dataList" :key="item.id" :label="item.name" :value="item.id"></el-option>
				</el-select>
			</el-form-item> -->
		</el-form>
		<div class="data-auth-block flex-box">
			<el-card class="data-field-card">
				<template #header>
					<el-input v-model="dataFieldTableFilterText" clearable>
						<template #append>
							<el-button icon="Search" @click="filterDataFieldTable(dataFieldTableFilterText)" circle /> </template
					></el-input>
				</template>
				<div class="block-tips"><span>分配数据</span></div>
				<div class="table-block">
					<el-table
						ref="dataListRef"
						:data="currentShowDataFieldTableData"
						@select="selectDataField"
						@selection-change="handleSelectChange"
						:show-header="false"
					>
						<el-table-column type="selection" :selectable="getDataFieldSelectable" width="28px"></el-table-column>
						<el-table-column prop="dataName"></el-table-column>
					</el-table>
				</div>
				<div class="pagination-block">
					<el-pagination
						:total="dataFieldList.length"
						:current-page="pageParams.pageNum"
						@current-change="handleCurrentPageChange"
						layout="prev, next"
						next-text="下一页"
						prev-text="上一页"
					>
					</el-pagination>
				</div>
			</el-card>
			<div class="operation-button">
				<div class="right-arrow" @click="appendAssignData"></div>
				<div class="left-arrow" @click="deleteAssignData"></div>
			</div>
			<el-card>
				<template #header>
					<el-input v-model="assignedDataTreeFilterText" clearable>
						<template #append>
							<el-button icon="Search" @click="filterAssignedDataTree(assignedDataTreeFilterText)" circle />
						</template>
					</el-input>
				</template>
				<div class="block-tips"><span>分配数据详情</span></div>
				<div class="assigned-data-block" v-loading="assignedDataBlockLoading">
					<el-scrollbar>
						<el-tree
							v-if="refreshAssignedDataTree"
							ref="assignedDataTreeRef"
							:data="assignedDataTree"
							show-checkbox
							:props="defaultProps"
							node-key="treeId"
							:expand-on-click-node="false"
							:default-expand-all="assignedDataTreeExpand"
							:filter-node-method="filterNode"
						>
							<template #default="{ node, data }">
								<span class="custom-tree-node">
									<span>{{ node.label }}</span>
									<span v-if="node.level >= 3">
										<a @click="nodeClick(node, data)">移除</a>
									</span>
								</span>
							</template>
						</el-tree>
					</el-scrollbar>
				</div>
			</el-card>
		</div>
		<!-- </div> -->

		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" @click="submit">提交</el-button>
			<!-- <el-button @click="check">check</el-button> -->
		</template>
	</el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick, onMounted, computed } from "vue";
import { ElSelect, ElTable, ElTree, FormInstance, FormRules, ElMessage } from "element-plus";
import type Node from "element-plus/es/components/tree/src/model/node";
// import useListPageHook from "@/hooks/listPage";
import {
	getUserDataPermissionApi,
	getDataPermissionApi,
	editUserDataPermissionApi,
} from "@/api/modules/systemManage/authorityCenter";

interface DrawerProps {
	// title: string;
	row: any;
	// api?: (params: any) => Promise<any>;
}
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
	// isView: false,
	// title: "",
	row: {},
});

const acceptParams = (params: DrawerProps) => {
	drawerProps.value = params;
	drawerVisible.value = true;
};

const handleDrawerOpen = () => {
	getAssignedDataTree();
	getDataAssetsFieldsParams.dataType = 0;
	getDataAssetsFieldsParams.type = 0;
	// resetAssignDataListAndDataFieldTable();
};
const handleDrawerClose = () => {
	getDataAssetsFieldsParams.dataType = "";
	getDataAssetsFieldsParams.type = "";
	dataFieldList.value = [];
	assignedDataTree.value = [];
	assignedDataTreeExpand.value = false;
	resetAssignedDataTree();
};

interface DataAssetsParamProps {
	dataType: any;
	type: any;
	// dataId?: number;
	// dataName?: string;
	// pageSize: number;
	// pageNum: number;
}
// const dataFieldQueryFormRef = ref<FormInstance>();
const getDataAssetsFieldsParams = reactive<DataAssetsParamProps>({
	dataType: "",
	type: "",
});
// {
// dataAssetsTypeId: "",
// dataTypeId: "",
// dataId: "",
// dataName: "",
// pageSize: 10,
// pageNum: 1,
// }

const dataAssetsRef = ref<InstanceType<typeof ElSelect>>();
const dataAssetsTypeRef = ref<InstanceType<typeof ElSelect>>();
const dataTypeRef = ref<InstanceType<typeof ElSelect>>();
// const dataTypeChosen = ref();
// const dataChosen = ref();

const dataAssetsTypeOptions = [
	{ id: 0, name: "接入数据" },
	{ id: 1, name: "输出数据" },
];

const dataTypeOptionsList = ref();
const dataTypeOptions = [
	{ id: 0, name: "测试数据" },
	{ id: 1, name: "正式数据" },
];

// const dataTypeOptionsTwo = [
// 	{ id: 5, name: "测试数据" },
// 	{ id: 6, name: "正式数据" },
// ];

// const dataArr = [
// 	{ id: 7, name: "数据名称A" },
// 	{ id: 8, name: "数据名称B" },
// 	{ id: 9, name: "数据名称C" },
// 	{ id: 10, name: "数据名称D" },
// 	{ id: 22, name: "数据名称E" },
// ];
// const dataList = ref();

const handleDataAssetsTypeChange = (val: any) => {
	// delete getDataAssetsParams.value.dataTypeId;
	// queryForm.value.dataId = "";

	getDataAssetsFieldsParams.type = "";

	// delete getDataAssetsFieldsParams.dataId;
	// if (val == 1) {
	// dataTypeOptionsList.value = dataTypeOptions;
	// } else if (val == 2) {
	// 	dataTypeOptionsList.value = dataTypeOptionsTwo;
	// }
	console.log(dataTypeOptionsList.value);
	// dataList.value = [];
	dataFieldList.value = [];
};

const handleDataTypeChange = () => {
	// queryForm.value.dataId = "";
	// delete getDataAssetsFieldsParams.dataId;
	resetPageParams();

	// getDataList();
	resetAssignDataListAndDataFieldTable();
	// dataList.value = [];
	// dataFieldList.value = [];
};

// const handleDataAssetsChange = () => {
// 	resetPageParams();
// 	resetAssignDataListAndDataFieldTable();
// 	getDataList();
// };

// let createTableByData = (pageSize: number, pageNum: number) => {
// 	let list = [];
// 	let i = 10;
// 	while (pageSize--) {
// 		list.push({
// 			id:
// 				i *
// 				getDataAssetsFieldsParams.dataAssetsTypeId! *
// 				getDataAssetsFieldsParams.dataTypeId! *
// 				getDataAssetsFieldsParams.dataId!,
// 			dataName: "字段" + pageNum,
// 		});
// 		i++;
// 		pageNum++;
// 	}
// 	return list;
// };

// 根据选择参数请求数据列表
// const getDataList = async () => {
// 	try {
// 		setTimeout(() => {
// 			dataList.value = dataArr;
// 		}, 500);
// 	} catch (err) {
// 		console.log(err);
// 	}
// };

const dataFieldList = ref<any>([]);

// 数据字段搜索
// const getDataField = (params: any) => {
// 	// try {
// 	// 	setTimeout(() => {
// 	// 		dataFieldList.value =
// 	// 	}, 500);
// 	// } catch (err) {
// 	// 	console.log(err);
// 	// }
// 	console.log({ ...params });
// 	return new Promise((resolve, reject) => {
// 		setTimeout((_) => {
// 			resolve({
// 				data: {
// 					total: params.pageSize,
// 					list: createTableByData(params.pageSize, params.pageNum),
// 				},
// 			});
// 		}, 500);
// 	});
// };

// 字段（目前弃用）
// const dataListRef = ref<InstanceType<typeof ElTable>>();
// let selectedDataTableItemList = reactive<{ [key: string]: any }>({}); // 当前显示字段表格选中数据字段列表(包括右侧树里的已经有的数据)
// const getDataList = async () => {
// 	const res: any = await getDataField(getDataAssetsFieldsParams);
// 	dataFieldList.value = res.data.list;
// };

// 左侧数据选取
const dataListRef = ref<InstanceType<typeof ElTable>>();
let selectedDataTableItemList = reactive<{ [key: string]: any }>({}); // 当前显示字段表格选中数据列表(包括右侧树里的已经有的数据)
const getDataList = async () => {
	try {
		const { data } = await getDataPermissionApi(getDataAssetsFieldsParams);
		dataFieldList.value = data;
	} catch (err) {
		console.log(err);
	}
};

const pageParams = reactive({
	pageSize: 10,
	pageNum: 1,
});

const currentShowDataFieldTableData = computed(() => {
	return dataFieldList.value
		.filter((data: any) => !tableFilterText.value || data.dataName.toLowerCase().includes(tableFilterText.value.toLowerCase()))
		.slice((pageParams.pageNum - 1) * pageParams.pageSize, pageParams.pageNum * pageParams.pageSize);
});

// 过左侧表格字段
const dataFieldTableFilterText = ref("");

// 点击后过滤字段
const tableFilterText = ref("");

const handleCurrentPageChange = (val: any) => {
	pageParams.pageNum = val;
};

const resetPageParams = () => {
	pageParams.pageNum = 1;
};

// const handlePagePreNextButton = () => {
// 	const preBtn = <HTMLImageElement>document.querySelector(".btn-prev");
// 	const nextBtn = <HTMLImageElement>document.querySelector(".btn-next");
// 	console.log(preBtn.style);
// 	console.log(nextBtn);
// 	if (preBtn?.getAttribute("aria-disabled")) {
// 		preBtn.classList.add("is-disable");
// 		console.log(preBtn.classList);
// 	}
// };

// 左侧数据表格处理
const selectDataField = (selection: any, row: any) => {
	// // console.log(selection);
	// // selectedDataTableItemList = s
	// console.log(row);
	// const dataTypeId = getDataAssetsFieldsParams.dataTypeId?.toString();
	// const dataId = getDataAssetsFieldsParams.dataId?.toString();
	// const dataAssetsId = getDataAssetsFieldsParams.dataAssetsTypeId?.toString();
	// // let newDataFieldSeletedObject: { [key: string]: Object[] } = {};
	// let newDataFieldSeletedObject: Array<Object> = [];
	// // let newDataTypeSeletedObject: { [key: string]: any } = {};

	// if (dataId && dataTypeId && dataAssetsId) {
	// 	// newDataTypeSeletedObject[dataTypeId] = { ...newDataFieldSeletedObject };

	// 	let deepGetItem = deepGet(selectedDataTableItemList, [dataAssetsId, dataTypeId, dataId], {});
	// 	console.warn(dataId);
	// 	console.warn(deepGetItem);
	// 	// console.warn(Array.isArray(deepGetItem));
	// 	// console.warn(deepGetItem[dataId]);
	// 	// deepGetItem = Array.from(deepGetItem);
	// 	// 判断处理取消选择
	// 	deepGetItem["children"] = Object.prototype.hasOwnProperty.call(deepGetItem, "children") ? [...deepGetItem["children"]] : [];

	// 	if (Object.prototype.hasOwnProperty.call(deepGetItem, "children")) {
	// 		let cancelItemIndex = deepGetItem["children"].findIndex((item: any) => item.id == row.id);
	// 		if (cancelItemIndex != -1) {
	// 			console.error("取消");
	// 			deepGetItem["children"].splice(cancelItemIndex, 1);
	// 		} else {
	// 			newDataFieldSeletedObject = [row];
	// 		}
	// 	}
	// 	console.log(deepGetItem["children"]);
	// 	// if (Object.prototype.hasOwnProperty.call(deepGetItem, row.id)) {
	// 	// 	console.error("取消");
	// 	// 	Reflect.deleteProperty(deepGetItem, row.id);
	// 	// }

	// 	// let deepGetItemList: any = [];
	// 	// if (Array.isArray(deepGetItem)) {
	// 	// 	deepGetItemList = deepGetItem;
	// 	// }

	// 	// console.error(deepGetItemList);
	// 	// let dataIdSelected: any = {};
	// 	// let dataTypeIdSelected: any = {};
	// 	let dataIdSelected: { [key: string]: any } = {};
	// 	let dataTypeIdSelected: { [key: string]: Object } = {};
	// 	let oldDataIdSelected = deepGet(selectedDataTableItemList, [dataAssetsId, dataTypeId, dataId], {});
	// 	let oldDataTypeIdSelected = deepGet(selectedDataTableItemList, [dataAssetsId, dataTypeId], {}) as {
	// 		[key: string]: Object;
	// 	};
	// 	let oldDataAssetsIdSelected = deepGet(selectedDataTableItemList, [dataAssetsId], {});
	// 	console.log("old>>>>>>>", dataIdSelected);
	// 	console.log("old>>>>>>>", dataTypeIdSelected);
	// 	// console.log(Array.from(new Set([...deepGetItem, ...newDataFieldSeletedObject[dataId]])));
	// 	oldDataIdSelected["children"] = Object.prototype.hasOwnProperty.call(oldDataIdSelected, "children")
	// 		? [...oldDataIdSelected["children"]]
	// 		: [];
	// 	dataIdSelected[dataId] = {
	// 		label: dataAssetsRef.value?.selectedLabel,
	// 		children: Array.from(new Set([...oldDataIdSelected["children"], ...deepGetItem["children"], ...newDataFieldSeletedObject])),
	// 	};
	// 	console.log("new>>>>>>>>", dataIdSelected);
	// 	dataTypeIdSelected[dataTypeId] = { ...oldDataTypeIdSelected, ...dataIdSelected };
	// 	console.log("new>>>>>>>", dataTypeIdSelected);

	// 	selectedDataTableItemList[dataAssetsId] = { ...oldDataAssetsIdSelected, ...dataTypeIdSelected };
	// }

	// 新需求

	// console.log(selection);
	// selectedDataTableItemList = s
	console.log(row);
	const dataTypeId = getDataAssetsFieldsParams.dataType?.toString() + getDataAssetsFieldsParams.type?.toString();
	const dataAssetsId = getDataAssetsFieldsParams.dataType?.toString();
	// let newDataFieldSeletedObject: { [key: string]: Object[] } = {};
	let newDataFieldSeletedObject: Array<Object> = [];
	// let newDataTypeSeletedObject: { [key: string]: any } = {};

	if (dataTypeId && dataAssetsId) {
		// newDataTypeSeletedObject[dataTypeId] = { ...newDataFieldSeletedObject };

		let deepGetItem = deepGet(selectedDataTableItemList, [dataAssetsId, dataTypeId], {});
		console.warn(dataTypeId);
		console.warn(deepGetItem);
		// console.warn(Array.isArray(deepGetItem));
		// console.warn(deepGetItem[dataId]);
		// deepGetItem = Array.from(deepGetItem);
		// 判断处理取消选择
		deepGetItem["children"] = Object.prototype.hasOwnProperty.call(deepGetItem, "children") ? [...deepGetItem["children"]] : [];

		if (Object.prototype.hasOwnProperty.call(deepGetItem, "children")) {
			let cancelItemIndex = deepGetItem["children"].findIndex((item: any) => item.dataId == row.dataId);
			if (cancelItemIndex != -1) {
				console.error("取消");
				deepGetItem["children"].splice(cancelItemIndex, 1);
			} else {
				newDataFieldSeletedObject = [row];
			}
		}
		console.log(deepGetItem["children"]);
		// if (Object.prototype.hasOwnProperty.call(deepGetItem, row.id)) {
		// 	console.error("取消");
		// 	Reflect.deleteProperty(deepGetItem, row.id);
		// }

		// let deepGetItemList: any = [];
		// if (Array.isArray(deepGetItem)) {
		// 	deepGetItemList = deepGetItem;
		// }

		// console.error(deepGetItemList);
		// let dataIdSelected: any = {};
		// let dataTypeIdSelected: any = {};
		let dataTypeIdSelected: { [key: string]: Object } = {};
		let oldDataTypeIdSelected = deepGet(selectedDataTableItemList, [dataAssetsId, dataTypeId], {});
		let oldDataAssetsIdSelected = deepGet(selectedDataTableItemList, [dataAssetsId], {});
		console.log("old>>>>>>> oldDataAssetsIdSelected", oldDataAssetsIdSelected);
		console.log("old>>>>>>> oldDataTypeIdSelected", dataTypeIdSelected);
		// console.log(Array.from(new Set([...deepGetItem, ...newDataFieldSeletedObject[dataId]])));
		oldDataTypeIdSelected["children"] = Object.prototype.hasOwnProperty.call(oldDataTypeIdSelected, "children")
			? [...oldDataTypeIdSelected["children"]]
			: [];
		dataTypeIdSelected[dataTypeId] = {
			label: dataTypeRef.value?.selectedLabel,
			children: Array.from(
				new Set([...oldDataTypeIdSelected["children"], ...deepGetItem["children"], ...newDataFieldSeletedObject])
			),
		};

		dataTypeIdSelected[dataTypeId] = { ...oldDataTypeIdSelected, ...dataTypeIdSelected[dataTypeId] };
		console.log("new>>>>>>>> dataTypeIdSelected", dataTypeIdSelected);

		selectedDataTableItemList[dataAssetsId] = { ...oldDataAssetsIdSelected, ...dataTypeIdSelected };
		console.log("new>>>>>>>> selectedDataTableItemList", selectedDataTableItemList);
	}
};

const handleSelectChange = (selection: any) => {
	// console.log(selection);
	// const dataTypeId = getDataAssetsFieldsParams.dataTypeId?.toString();
	// const dataId = getDataAssetsFieldsParams.dataId?.toString();
	// const dataAssetsId = getDataAssetsFieldsParams.dataAssetsTypeId?.toString();
	// let newDataFieldSeletedObject: { [key: string]: any } = {};
	// let newDataTypeSeletedObject: { [key: string]: any } = {};
	// if (dataId && dataTypeId && dataAssetsId) {
	// 	newDataFieldSeletedObject[dataId] = selection;
	// 	newDataTypeSeletedObject[dataTypeId] = { ...newDataFieldSeletedObject };
	// 	const deepGetItem = deepGet(selectedDataTableItemList, [dataAssetsId, dataTypeId], dataId);
	// 	console.warn(deepGetItem[dataId]);
	// 	let dataIdSelected: any = {};
	// 	let dataTypeIdSelected: any = {};
	// 	dataIdSelected[dataId] = Array.from(new Set([...deepGetItem[dataId], ...newDataFieldSeletedObject[dataId]]));
	// 	dataTypeIdSelected[dataTypeId] = {
	// 		...dataIdSelected,
	// 	};
	// 	selectedDataTableItemList[dataAssetsId] = {
	// 		...dataTypeIdSelected,
	// 	};
	// }
};

interface DeepGet {
	[key: string]: any;
	// children?: Array<object>
}
const deepGet = (obj: { [key: string]: any }, keys: string | Array<string>, defaultVal?: any): DeepGet => {
	// let defaultObj: any = {};
	// defaultObj[defaultVal] = [];
	return (
		(!Array.isArray(keys) ? keys.replace(/\[/g, ".").replace(/\]/g, "").split(".") : keys).reduce((o, k) => (o || {})[k], obj) ||
		defaultVal
	);
};

// 获取已分配数据的leaf的字段数组
const getAssignedDataTreeLeaf = () => {
	// let assignedDataTreeLeafArray: Array<Object> = [];
	// if (getDataAssetsFieldsParams.dataAssetsTypeId && getDataAssetsFieldsParams.dataTypeId && getDataAssetsFieldsParams.dataId) {
	// 	const tree = assignedDataTree.value.find((item) => item.id == getDataAssetsFieldsParams.dataAssetsTypeId);
	// 	console.log(tree);
	// 	if (tree != undefined) {
	// 		assignedDataTreeLeafArray = treeDeepGet(tree, [
	// 			getDataAssetsFieldsParams.dataAssetsTypeId,
	// 			getDataAssetsFieldsParams.dataTypeId,
	// 			getDataAssetsFieldsParams.dataId,
	// 		]) as Array<object>;
	// 	}
	// }
	// console.log(assignedDataTreeLeafArray);
	// return assignedDataTreeLeafArray;

	// * 新需求 只细化到接入输出
	let assignedDataTreeLeafArray: Array<Object> = [];
	if (getDataAssetsFieldsParams.dataType !== "" && getDataAssetsFieldsParams.type !== "") {
		const tree = assignedDataTree.value.find((item) => item.id == getDataAssetsFieldsParams.dataType);
		console.log(tree);
		if (tree != undefined) {
			assignedDataTreeLeafArray = treeDeepGet(tree, [
				getDataAssetsFieldsParams.dataType.toString(),
				getDataAssetsFieldsParams.dataType.toString() + getDataAssetsFieldsParams.type.toString(),
			]) as Array<object>;
		}
	}
	console.log(assignedDataTreeLeafArray);
	return assignedDataTreeLeafArray;
};

const treeDeepGet = (tree: any, keys: Array<string>) => {
	return (
		keys.reduce((accumulator: any, current: any, currentIndex: number) => {
			console.log("accumulator>>>>>>", accumulator);
			console.log("current>>>>>>", current);
			// if (accumulator) return accumulator;
			console.log("currentIndex>>>>>>", currentIndex);
			if (currentIndex == keys.length - 1) {
				if (Object.prototype.hasOwnProperty.call(accumulator, "children") && Array.isArray(accumulator["children"])) {
					const data = accumulator["children"].find((item) => item.children && item.treeId == current);
					if (data != undefined && Object.prototype.hasOwnProperty.call(data, "children")) {
						return data["children"];
					}
				}
			}
			// if (Array.isArray(accumulator)) {
			// 	return accumulator.find((item) => item.children && item.treeId == current);
			// }

			// * 只找到type 需要返回children
			if (Array.isArray(accumulator)) {
				return accumulator.find((item) => item.children && item.treeId == current)["children"];
			}

			if (accumulator["treeId"] == current) return accumulator["children"];
			if (Array.isArray(accumulator) && !Object.prototype.hasOwnProperty.call(accumulator, "children")) return accumulator;
		}, tree) || []
	);
};

const assignDataInDataField = ref<Array<Object>>([]); // 已分配数据数组

const selectDefaultDataFieldTable = async () => {
	// let deepGetItemList: any = {};
	// if (getDataAssetsFieldsParams.dataAssetsTypeId && getDataAssetsFieldsParams.dataTypeId && getDataAssetsFieldsParams.dataId) {
	// 	deepGetItemList = deepGet(
	// 		selectedDataTableItemList,
	// 		[
	// 			getDataAssetsFieldsParams.dataAssetsTypeId.toString(),
	// 			getDataAssetsFieldsParams.dataTypeId.toString(),
	// 			getDataAssetsFieldsParams.dataId.toString(),
	// 		],
	// 		{}
	// 	);
	// }
	// console.log(deepGetItemList);
	// if (Object.prototype.hasOwnProperty.call(deepGetItemList, "children")) {
	// 	deepGetItemList = Array.from(deepGetItemList["children"]);
	// }

	// // deepGetItemList.forEach((item: any) => {
	// // 	console.log(item);
	// // });
	// await dataListRef.value!.clearSelection();
	// if (deepGetItemList.length) {
	// 	deepGetItemList.forEach((item: any) => {
	// 		nextTick(() => {
	// 			currentShowDataFieldTableData.value.forEach((tableItem: any) => {
	// 				if (tableItem.id == item.id) {
	// 					dataListRef.value!.toggleRowSelection(tableItem, true);
	// 				}
	// 			});
	// 		});
	// 	});
	// }
	// console.warn(assignDataInDataField.value);
	// if (assignDataInDataField.value.length) {
	// 	assignDataInDataField.value.forEach((item: any) => {
	// 		nextTick(() => {
	// 			currentShowDataFieldTableData.value.forEach((tableItem: any) => {
	// 				if (tableItem.id == item.id) {
	// 					dataListRef.value!.toggleRowSelection(tableItem, true);
	// 				}
	// 			});
	// 		});
	// 	});
	// }

	// * 新需求 只细化到接入输出
	let deepGetItemList: any = {};
	if (getDataAssetsFieldsParams.dataType !== "" && getDataAssetsFieldsParams.type !== "") {
		deepGetItemList = deepGet(
			selectedDataTableItemList,
			[
				getDataAssetsFieldsParams.dataType?.toString(),
				getDataAssetsFieldsParams.dataType?.toString() + getDataAssetsFieldsParams.type?.toString(),
			],
			{}
		);
	}
	console.log(deepGetItemList);
	if (Object.prototype.hasOwnProperty.call(deepGetItemList, "children")) {
		deepGetItemList = Array.from(deepGetItemList["children"]);
	}

	// deepGetItemList.forEach((item: any) => {
	// 	console.log(item);
	// });
	await dataListRef.value!.clearSelection();
	if (deepGetItemList.length) {
		deepGetItemList.forEach((item: any) => {
			nextTick(() => {
				currentShowDataFieldTableData.value.forEach((tableItem: any) => {
					if (tableItem.dataId == item.dataId) {
						dataListRef.value!.toggleRowSelection(tableItem, true);
					}
				});
			});
		});
	}
	console.warn(assignDataInDataField.value);
	if (assignDataInDataField.value.length) {
		assignDataInDataField.value.forEach((item: any) => {
			nextTick(() => {
				currentShowDataFieldTableData.value.forEach((tableItem: any) => {
					if (tableItem.dataId == item.id) {
						dataListRef.value!.toggleRowSelection(tableItem, true);
					}
				});
			});
		});
	}
};

const getDataFieldSelectable = (row: any, index: any) => {
	const foundedIndex = assignDataInDataField.value.findIndex((item: any) => item.id == row.dataId);
	return foundedIndex == -1 ? true : false;
};

// 已分配数据
const assignedDataBlockLoading = ref(false);
const assignedDataTreeFilterText = ref("");

const defaultProps = {
	children: "children",
	label: "label",
};

interface Tree {
	id: number;
	label: string;
	treeId: string;
	dataType?: number;
	type?: number;
	children?: Tree[];
}
const assignedDataTreeRef = ref<InstanceType<typeof ElTree>>();
const assignedDataTree = ref<Tree[]>([]);
// 默认展开右侧数据权限树
const assignedDataTreeExpand = ref(false);
// 默认展开的节点数组
const defaultExpandedKeysArr = ref<Array<string>>([]);
const refreshAssignedDataTree = ref(true);
// 请求已分配数据树
// interface DataTree {
// 	id: number;
// 	dataType: number;
// 	label: string;
// 	treeId: string;
// 	children: any;
// }
const dataTree = ref<Tree[]>([
	{
		id: 0,
		dataType: 0,
		label: "接入数据",
		treeId: "0",
		children: [
			{
				id: 0,
				type: 0,
				label: "测试数据",
				treeId: "00",
				children: [
					// {
					// 	id: 7,
					// 	label: "接入-测试-数据1",
					// 	children: [
					// 		{
					// 			id: 12,
					// 			label: "接入-测试-数据1-字段1",
					// 		},
					// 		{
					// 			id: 13,
					// 			label: "接入-测试-数据1-字段2",
					// 		},
					// 	],
					// },
					// {
					// 	id: 8,
					// 	label: "接入-测试-数据2",
					// 	children: [
					// 		{
					// 			id: 14,
					// 			label: "接入-测试-数据2-字段1",
					// 		},
					// 		{
					// 			id: 15,
					// 			label: "接入-测试-数据2-字段2",
					// 		},
					// 	],
					// },
				],
			},
			{
				id: 1,
				type: 1,
				label: "正式数据",
				treeId: "01",
				children: [
					// {
					// 	id: 9,
					// 	label: "接入-正式数据1",
					// 	children: [
					// 		{
					// 			id: 16,
					// 			label: "接入-正式-数据1-字段1",
					// 		},
					// 		{
					// 			id: 17,
					// 			label: "接入-正式-数据1-字段2",
					// 		},
					// 	],
					// },
				],
			},
		],
	},
	{
		id: 1,
		dataType: 1,
		label: "输出数据",
		treeId: "1",
		children: [
			{
				id: 0,
				type: 0,
				label: "测试数据",
				treeId: "10",
				children: [
					// {
					// 	id: 10,
					// 	label: "输出-测试-数据1",
					// 	children: [
					// 		{
					// 			id: 18,
					// 			label: "输出-测试-数据1-字段1",
					// 		},
					// 		{
					// 			id: 19,
					// 			label: "输出-测试-数据1-字段2",
					// 		},
					// 	],
					// },
				],
			},
			{
				id: 1,
				type: 1,
				label: "正式数据",
				treeId: "11",
				children: [
					// {
					// 	id: 11,
					// 	label: "输出-正式-数据1",
					// 	children: [
					// 		{
					// 			id: 20,
					// 			label: "输出-正式-数据1-字段1",
					// 		},
					// 		{
					// 			id: 21,
					// 			label: "输出-正式-数据1-字段2",
					// 		},
					// 	],
					// },
				],
			},
		],
	},
]);

const getAssignedDataTree = async () => {
	try {
		// assignedDataBlockLoading.value = true;
		console.log(drawerProps.value.row.id);
		const params = { userId: drawerProps.value.row.id };
		const { data } = await getUserDataPermissionApi(params);
		console.log("assignedData", data);
		renderAssignedDataTree(data);
		if (data.length) {
			assignedDataTreeExpand.value = true;
		}
		console.error(dataTree.value);
		assignedDataTree.value = dataTree.value;
		// refreshDefaultExpandedKeysArr(assignedDataTree.value);
		refreshDataAssignedTree(); // 刷新树
		resetAssignDataListAndDataFieldTable();
	} catch (err) {
		console.log(err);
	} finally {
		// assignedDataBlockLoading.value = false;
	}
};

// 渲染右侧数据权限树
const renderAssignedDataTree = (dataPermissionList: Array<any>) => {
	const assignedDataArr = dataPermissionList;
	if (assignedDataArr.length) {
		assignedDataArr.forEach((item: any) => {
			if (
				Object.prototype.hasOwnProperty.call(item, "dataType") &&
				Object.prototype.hasOwnProperty.call(item, "list") &&
				Array.isArray(item["list"]) &&
				item["list"].length
			) {
				item["list"].forEach((element: any) => {
					if (
						Object.prototype.hasOwnProperty.call(element, "type") &&
						Object.prototype.hasOwnProperty.call(element, "dataList") &&
						Array.isArray(element["dataList"]) &&
						element["dataList"].length
					) {
						// console.log(element)
						let renderArr: any = [];
						element["dataList"].forEach((dataListItem: any) => {
							let newObject = {
								id: dataListItem.dataId,
								label: dataListItem.dataName,
								treeId: item["dataType"].toString() + element["type"].toString() + dataListItem.dataId.toString(),
							};
							renderArr.push(newObject);
							// dataListItem["id"] = dataListItem.dataId;
							// dataListItem["label"] = dataListItem.dataName;
							// dataListItem["treeId"] = item["dataType"].toString() + element["type"].toString() + dataListItem.dataId.toString();
						});
						// console.log(renderArr);
						if (dataTree.value[item["dataType"]] && dataTree.value[item["dataType"]]["children"] !== undefined) {
							if (dataTree.value[item["dataType"]]["children"]) {
								dataTree.value[item["dataType"]]["children"]![element["type"]]["children"] = renderArr;
							}
						}
					}
				});
			}
			// console.log(item)
		});
	}
};
// 刷新默认展开节点Arr
const refreshDefaultExpandedKeysArr = (assginedDataTree: Tree[]) => {
	// let newDefaultExpandedKeysArr: Array<string> = [];
	defaultExpandedKeysArr.value = [];
	console.error(assginedDataTree);
	assginedDataTree.forEach((dataTypeItem: Tree) => {
		if (
			Object.prototype.hasOwnProperty.call(dataTypeItem, "dataType") &&
			Object.prototype.hasOwnProperty.call(dataTypeItem, "children") &&
			dataTypeItem["children"] &&
			dataTypeItem["children"].length
		) {
			dataTypeItem.children.forEach((typeItem: Tree) => {
				console.log(
					Object.prototype.hasOwnProperty.call(typeItem, "type"),
					Object.prototype.hasOwnProperty.call(typeItem, "children"),
					typeItem["children"],
					typeItem["children"]!.length
				);
				if (
					Object.prototype.hasOwnProperty.call(typeItem, "type") &&
					Object.prototype.hasOwnProperty.call(typeItem, "children") &&
					typeItem["children"] &&
					typeItem["children"].length
				) {
					console.log(typeItem.children);
					typeItem.children.forEach((item: Tree) => {
						defaultExpandedKeysArr.value.push(item.treeId);
					});
				}
			});
		}
	});
	console.log(defaultExpandedKeysArr.value);
	defaultExpandedKeysArr.value.forEach((treeId: string) => {
		nextTick(() => {
			assignedDataTreeRef.value?.setCurrentKey(treeId);
		});
	});
	// refreshDataAssignedTree();
	// return newDefaultExpandedKeysArr;
};

const refreshDataAssignedTree = () => {
	refreshAssignedDataTree.value = false;
	nextTick(() => {
		refreshAssignedDataTree.value = true;
	});
};

// 关闭重置数据树
const resetAssignedDataTree = () => {
	dataTree.value.forEach((item: any) => {
		if (
			Object.prototype.hasOwnProperty.call(item, "dataType") &&
			Object.prototype.hasOwnProperty.call(item, "children") &&
			Array.isArray(item["children"]) &&
			item["children"].length
		) {
			item["children"].forEach((dataTypeChild: any) => {
				if (
					Object.prototype.hasOwnProperty.call(dataTypeChild, "type") &&
					Object.prototype.hasOwnProperty.call(dataTypeChild, "children") &&
					Array.isArray(dataTypeChild["children"]) &&
					dataTypeChild["children"].length
				) {
					dataTypeChild["children"] = [];
				}
			});
		}
	});
};

const nodeClick = (node: Node, data: Tree) => {
	console.log("node>>>>>>", node);
	console.log("data>>>>>>", data);
	const parent = node.parent;
	const children: Tree[] = parent.data.children || parent.data;
	// if (parent && parent.data) {

	// }
	const index = children.findIndex((d) => d.id === data.id);
	children.splice(index, 1);
	// assignedDataTree.value = [...assignedDataTree.value];
	node.loaded = false;
	node.expand(); // 主动调用展开节点方法，重新查询该节点下的所有子节点
	resetAssignDataListAndDataFieldTable();
};

const deleteAssignData = () => {
	console.warn(assignedDataTreeRef.value?.getCheckedNodes());
	console.warn(assignedDataTreeRef.value?.getCheckedKeys(true));
	const checkedAssignDataList = assignedDataTreeRef.value?.getCheckedNodes().reverse();
	console.log(checkedAssignDataList);
	if (assignedDataTreeRef.value && checkedAssignDataList && checkedAssignDataList?.length) {
		checkedAssignDataList.forEach((item: any) => {
			const getItemNode = assignedDataTreeRef.value!.getNode(item);
			console.log(getItemNode);
			if (getItemNode.level > 2) assignedDataTreeRef.value?.remove(item);
		});
	}
	nextTick(() => {
		assignedDataTreeRef.value?.setCheckedKeys([]); //清空勾选框
	});
	resetAssignDataListAndDataFieldTable();

	// console.error(assignedDataTreeRef.value?.getHalfCheckedNodes());
	// console.error(assignedDataTreeRef.value?.getHalfCheckedKeys());
	// console.warn(assignedDataTreeRef.value?.getCurrentKey());
	// console.warn(assignedDataTreeRef.value?.getCurrentNode());
};

const appendAssignData = () => {
	itorKey(selectedDataTableItemList); // 添加到右侧树结构
	selectedDataTableItemList = {};
	resetAssignDataListAndDataFieldTable();
	console.warn(assignedDataTree.value);
	// refreshDefaultExpandedKeysArr(assignedDataTree.value);
};

// 遍历多层对象

const itorKey = (obj: { [key: string]: any }, oldKey?: any) => {
	const isObj = (objParams: object) => {
		return typeof objParams === "object";
	};

	if (isObj(obj)) {
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				const element = obj[key];
				// console.log(oldKey);
				// console.log(key);
				if (
					isObj(element) &&
					!Object.prototype.hasOwnProperty.call(element, "label") &&
					!Object.prototype.hasOwnProperty.call(element, "children")
				) {
					// console.log(element);
					itorKey(element, key);
				} else if (
					isObj(element) &&
					Object.prototype.hasOwnProperty.call(element, "label") &&
					Object.prototype.hasOwnProperty.call(element, "children")
				) {
					// console.log(key);

					// console.log(element);
					const assginDataTreeNode = assignedDataTreeRef.value?.getNode(key);
					console.log(assginDataTreeNode);
					console.log(assginDataTreeNode?.key);
					if (element["children"].length) {
						if (assginDataTreeNode) {
							element["children"].forEach((item: any) => {
								const newDataField = { id: item.dataId, label: item.dataName, treeId: assginDataTreeNode.key + item.dataId };
								nextTick(() => {
									assignedDataTreeRef.value?.append(newDataField, key);
								});
							});
						} else {
							const newDataAssets = { id: key, label: element["label"], children: [] };
							nextTick(() => {
								console.log(oldKey);
								assignedDataTreeRef.value?.append(newDataAssets, oldKey);
							});
							element["children"].forEach((item: any) => {
								const newDataField = { id: item.dataId, label: item.dataName };
								nextTick(() => {
									assignedDataTreeRef.value?.append(newDataField, key);
								});
							});
						}
					}
				}
			}
		}
		return;
	}
};

// 刷新已分配数据和左侧表格
const resetAssignDataListAndDataFieldTable = () => {
	assignDataInDataField.value = getAssignedDataTreeLeaf();
	selectDefaultDataFieldTable();
};

const submit = async () => {
	try {
		const params = {
			userId: drawerProps.value.row.id,
			list: buildDataPermissonList(assignedDataTree.value),
		};
		if (!params.list.length) {
			delete params.list;
		}
		await editUserDataPermissionApi(params);
		// ElNotification({
		// 	title: "操作成功",
		// 	message: "编辑数据权限成功!",
		// 	type: "success",
		// });
		ElMessage.success("编辑数据权限成功");
		drawerVisible.value = false;
	} catch (err) {
		console.log(err);
	}
};

// 提交数据权限 list参数构造
const buildDataPermissonList = (dataTree: Tree[]) => {
	let dataPermisionList: any = [];
	dataTree.forEach((dataTypeItem: Tree) => {
		let newItem: any = {};
		let dataTypePermission: any = [];
		if (
			Object.prototype.hasOwnProperty.call(dataTypeItem, "dataType") &&
			Object.prototype.hasOwnProperty.call(dataTypeItem, "children") &&
			dataTypeItem["children"] &&
			dataTypeItem["children"].length
		) {
			dataTypeItem.children.forEach((typeItem: Tree) => {
				if (
					Object.prototype.hasOwnProperty.call(typeItem, "type") &&
					Object.prototype.hasOwnProperty.call(typeItem, "children") &&
					typeItem["children"] &&
					typeItem["children"].length
				) {
					typeItem["children"].forEach((item: Tree) => {
						dataTypePermission.push(item.id);
					});
				}
			});
			if (dataTypePermission.length) {
				newItem["dataType"] = dataTypeItem.dataType;
				newItem["dataIdList"] = dataTypePermission;
				dataPermisionList.push(newItem);
			}
		}
	});
	return dataPermisionList;
};
// 过滤右侧数据树方法
const filterAssignedDataTree = (filterText: string) => {
	assignedDataTreeRef.value!.filter(filterText);
};

const filterDataFieldTable = (filterText: string) => {
	tableFilterText.value = filterText;
};

const check = () => {
	console.log(drawerProps.value.row);
	console.log(getDataAssetsFieldsParams);
	console.log(selectedDataTableItemList);
	console.log(assignDataInDataField.value);
	console.log(currentShowDataFieldTableData.value);
	console.log(dataListRef.value!.getSelectionRows());
	console.log(assignedDataTree.value);
	console.error(
		deepGet(
			selectedDataTableItemList,
			[getDataAssetsFieldsParams.dataType?.toString(), getDataAssetsFieldsParams.type?.toString()],
			{}
		)
	);
	// dataTree[0]["children"][0]["children"] = [1,2,3]
	console.log(assignedDataTreeRef.value!.data);
	// console.log(refreshDefaultExpandedKeysArr(assignedDataTree.value));
	console.log(defaultExpandedKeysArr.value);
};

watch(
	() => {
		return { ...getDataAssetsFieldsParams };
	},
	(newVal, oldVal) =>
		nextTick(() => {
			{
				// console.log(newVal);
				// console.log(oldVal);
				// if (newVal.dataAssetsTypeId && newVal.dataTypeId && !newVal.dataId) {
				// 	console.log("getNewDataList");

				// 	getDataList();
				// } else if (newVal.dataAssetsTypeId && newVal.dataTypeId && newVal.dataId) {
				// 	console.log("getDataList");
				// 	// searchByQueryForm();
				// }
				console.log(newVal);
				if (newVal.dataType !== "" && newVal.type !== "") {
					console.log("getNewDataList");

					getDataList();
				}
			}
		}),
	{
		deep: true,
	}
);

watch(
	() => currentShowDataFieldTableData.value,

	(newVal, oldVal) =>
		nextTick(() => {
			console.log(newVal);
			console.log(oldVal);
			selectDefaultDataFieldTable();
		}),
	{
		deep: true,
	}
);

watch(
	() => assignedDataTree.value,

	(newVal, oldVal) =>
		nextTick(() => {
			console.log(newVal);
			console.log(oldVal);
			refreshDefaultExpandedKeysArr(assignedDataTree.value);
		}),
	{
		deep: true,
	}
);
// watch(assignedDataTreeFilterText, val => {
//   assignedDataTreeRef.value!.filter(val);
// });

// watch(
// 	() => assignedDataTreeExpand.value,

// 	(newVal, oldVal) =>
// 		nextTick(() => {
// 			console.log(newVal);
// 			console.log(oldVal);

// 				refreshAssignedDataTree.value = false;
// 				nextTick(() => {
// 					refreshAssignedDataTree.value = true;
// 				})

// 		}),
// 	{
// 		deep: true,
// 	}
// );
// 过滤
const filterNode = (value: string, data: { [key: string]: any }, node: any) => {
	if (!value) return true;
	let parentNode = node.parent,
		labels = [node.label],
		level = 1;
	while (level < node.level) {
		labels = [...labels, parentNode.label];
		parentNode = parentNode.parent;
		level++;
	}
	return labels.some((label) => label.indexOf(value) !== -1);
};

defineExpose({
	acceptParams,
});
</script>

<style lang="scss" scoped>
@import "@/styles/common";
.el-form {
	display: flex;
	.el-form-item {
		// flex: 1;
		margin-right: 5px;
		margin-bottom: 0;
	}
}
.data-auth-block {
	margin-top: 37px;
	height: calc(100% - 37px - 32px);
	:deep(.el-card) {
		flex: 1;
		box-shadow: none;
		.el-card__header {
			padding: 12px 18px 0;
			border-bottom: 0;

			// border-image-width: 0;
			.el-input {
				.el-input__wrapper {
					border: 1px solid var(--el-input-border-color, var(--el-border-color));
					border-right: none;
					box-shadow: none;
				}
				.el-input-group__append {
					// padding: 1px 10px 1px 0;
					border: 1px solid var(--el-input-border-color, var(--el-border-color));
					border-left: none;
					background-color: #fff;
					box-shadow: none;
					.el-button {
						&:hover {
							color: var(--el-color-primary);
						}
					}
				}
				.el-input__wrapper.is-focus {
					border-color: var(--el-color-primary);
					+ .el-input-group__append {
						border-color: var(--el-color-primary);
					}
				}
			}
		}
		.el-card__body {
			padding: 10px 18px 0;
			height: calc(100% - 56px);
		}
		.block-tips {
			padding-left: 13px;
			border-radius: 4px;
			height: 32px;
			background: rgb(243 243 243 / 60%);
			span {
				line-height: 32px;
				font-family: "PingFang SC-Medium", "PingFang SC";
				font-weight: 500;
				font-size: 14px;
				color: #606266;
			}
		}
		.table-block {
			height: calc(100% - 88px);
			.el-table {
				max-height: 100%;
				.el-table__inner-wrapper {
					.el-table__body-wrapper {
						.el-table__body {
							tbody {
								tr {
									td {
										border-bottom: none;
										&:nth-of-type(2) {
											.cell {
												margin-left: 8px;
												padding: 0;
												color: #606266;

												// padding-right: 0;
											}
										}
									}
								}
							}
						}
					}
					&::before {
						height: 0;
					}
				}
			}
		}
	}
	.data-field-card {
		position: relative;
		.pagination-block {
			position: absolute;
			right: 30px;
			bottom: 14px;
			margin: 0;
			:deep(.el-pagination) {
				display: flex;

				// flex-direction: row-reverse;
				justify-content: flex-end;

				// margin: 29px 0;

				// margin-left: 30px;
				// margin-right: 30px;
				.btn-prev.is-disable {
					display: none;
				}
			}
		}
	}
	.operation-button {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 0 13px;
		.right-arrow {
			margin-bottom: 5px;
			border-radius: 50%;
			width: 24px;
			height: 24px;
			background-image: url("@/assets/images/systemManage/authorityCenter/accountManage/right_arrow.png");
			background-size: cover;
			cursor: pointer;
		}
		.left-arrow {
			margin-top: 5px;
			border-radius: 50%;
			width: 24px;
			height: 24px;
			background-image: url("@/assets/images/systemManage/authorityCenter/accountManage/left_arrow.png");
			background-size: cover;
			cursor: pointer;
		}
	}
	.assigned-data-block {
		margin-top: 10px;
		height: calc(100% - 42px);
		.el-scrollbar {
			height: 100%;
		}
		.custom-tree-node {
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex: 1;
			padding-right: 8px;
			font-weight: 400;
			font-size: 14px;
			color: #606266;
			span {
				&:nth-of-type(2) {
					color: var(--el-color-primary);
				}
			}
		}
	}
}
</style>
