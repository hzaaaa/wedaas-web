<template>
	<el-dialog title="" class="data-source-add-edit-dialog" v-model="dialogVisible">
		<template #header="{ titleId, titleClass }">
			<div class="my-header">
				<el-steps :active="active" finish-status="success" :id="titleId" :class="titleClass">
					<!-- <el-step>
						<template #icon
							><div class="step-icon">
								<span v-if="active == 0">1</span><el-icon v-else><Check /></el-icon>
							</div>

							<span class="step-text">数据源类型</span></template
						>
					</el-step>
					<el-step
						><template #icon
							><div class="step-icon">
								<span v-if="active == 1 || active == 0">2</span><el-icon v-else><Check /></el-icon>
							</div>

							<span class="step-text">基础信息</span></template
						></el-step
					>
					<el-step
						><template #icon
							><div class="step-icon">
								<span v-if="active == 2 || active == 1 || active == 0">3</span><el-icon v-else><Check /></el-icon>
							</div>

							<span class="step-text">选择数据库</span></template
						></el-step
					> -->
					<el-step v-for="(item, index) in showedStepsList" :key="index">
						<template #icon
							><div class="step-icon">
								<span v-if="active <= index">{{ item.step }}</span
								><el-icon v-else><Check /></el-icon>
							</div>

							<span class="step-text">{{ item.text }}</span></template
						>
					</el-step>
				</el-steps>
			</div>
		</template>

		<component
			v-for="(item, index) in componentsList"
			:key="index"
			:is="item.com"
			:ref="(el: any) => setComRef(el, item.reference)"
			v-show="active == index"
		></component>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary">测试连接</el-button>
				<el-button @click="previous">上一步</el-button>
				<el-button type="primary" @click="next"> 下一步 </el-button>
				<el-button type="primary" @click="dialogVisible = false"> 取消 </el-button>
				<el-button @click="check()">check</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import DataSourceList from "./DataSourceList.vue";
import BasicInfoForm from "./BasicInfoForm.vue";
import AddEditDatabase from "./AddEditDatabase.vue";
const dialogVisible = ref(false);

const active = ref(0);

const stepsList = [
	{ text: "数据源类型", step: "1" },
	{ text: "基础信息", step: "2" },
	{ text: "选择数据库", step: "3" },
];

const showedStepsList = computed(() => {
	return comRefs.value["dataSourceListRef"].hadoopDatabaseChosen ? stepsList.slice(0, 2) : stepsList;
});

const componentsList = [
	{ com: DataSourceList, reference: "dataSourceListRef" },
	{ com: BasicInfoForm, reference: "basicInfoFormRef" },
	{ com: AddEditDatabase, reference: "addEditDatabase" },
];
const dataSourceListRef = ref<InstanceType<typeof DataSourceList> | null>(null);
const comRefs = ref<any>({ dataSourceListRef: { hadoopDatabaseChosen: undefined } });
const setComRef = (el: any, key: string) => {
	console.log(el);
	if (el) {
		comRefs.value[key] = el;
	}
};
const activeComponent = computed(() => {
	return active.value == 0 ? DataSourceList : "";
});

interface DialogProps {
	info: any;
	// api?: (params: any) => Promise<any>;
}

const dialogProps = ref<DialogProps>({
	info: "",
});

const next = () => {
	if (active.value++ > 2) active.value = 0;
};

const previous = () => {
	active.value--;
};

const acceptParams = (params: DialogProps) => {
	console.log(params);
	dialogProps.value = params;
	dialogVisible.value = true;
};

const appLogType = ref(0);

const tableLoading = ref(false);

const tableDataList = ref([]);

const check = () => {
	console.log(comRefs.value["dataSourceListRef"].hadoopDatabaseChosen);
	console.log(
		Object.prototype.hasOwnProperty.call(comRefs.value, "dataSourceListRef") &&
			comRefs.value["dataSourceListRef"].hadoopDatabaseChosen
	);
	console.log(stepsList.slice(0, 2));
	console.log(showedStepsList.value);
};

defineExpose({
	acceptParams,
});
</script>

<style lang="scss">
.el-dialog.data-source-add-edit-dialog {
	width: 1000px;
	.el-dialog__header {
		.my-header {
			.el-steps.el-dialog__title {
				.el-step {
					margin-right: 16px;
					.el-step__head {
						.el-step__icon {
							padding: 0 16px 0 0;
							width: fit-content;
							.step-icon {
								display: flex;
								justify-content: center;
								align-items: center;
								margin-right: 8px;
								border: 1px solid rgb(0 0 0 / 25%);
								border-radius: 50%;
								width: 22px;
								height: 22px;
								span.step-text {
									font-size: 14px;
									color: rgb(0 0 0 / 25%);
								}
							}
						}
						&.is-process {
							.el-step__icon {
								.step-icon {
									border-color: #ff8259;
									background-color: #ff8259;
									span {
										color: #fff;
									}
								}
								span.step-text {
									font-weight: 500;
									color: #27272e;
								}
							}
						}
						&.is-success {
							.el-step__icon {
								.step-icon {
									border-color: var(--el-color-success);
								}
								span.step-text {
									color: var(--el-text-color-primary);
								}
							}
						}
					}
				}
			}
		}
	}
	.el-dialog__body {
		// height: 445px;
		height: 600px;
	}
}
</style>
