<template>
	<div class="api-config">
		<el-steps :active="activeName" align-center class="mt10" style="border-bottom: 1px solid var(--bc)">
			<el-step title="基础信息" />
			<el-step title="参数配置" />
			<el-step title="接口测试" />
		</el-steps>
		<el-radio-group v-show="activeName === 2" v-model="paramsConfigRadio" style="position: absolute; right: 40px; top: 20px">
			<el-radio label="config">配置</el-radio>
			<el-radio label="code">代码</el-radio>
		</el-radio-group>
		<div class="content-block">
			<el-tabs v-model="activeName" class="full-content-tabs">
				<el-tab-pane label="基础信息" :name="1">
					<el-form
						ref="inputInfoRef"
						:model="inputInfo"
						:rules="rulesForm"
						label-position="right"
						style="width: 600px"
						label-width="auto"
					>
						<el-form-item label="API名称" prop="apiName">
							<el-input v-model="inputInfo.apiName" show-word-limit placeholder="" />
						</el-form-item>
						<el-form-item label="API路径" prop="apiPath">
							<el-cascader
								style="width: 100%"
								v-model="inputInfo.apiPath"
								:options="pathOptions"
								:props="{
									value: 'name',
									label: 'name',
									children: 'childTuple',
								}"
								@change=""
							/>
						</el-form-item>
						<el-form-item label="目录" prop="apiCatalog">
							<!-- <el-select style="width: 100%" v-model="inputInfo.apiCatalog"></el-select> -->
							<el-cascader
								style="width: 100%"
								v-model="inputInfo.apiCatalog"
								:options="catalogOptions"
								:props="{
									value: 'id',
									label: 'name',
									children: 'childs',
								}"
								popper-class="custom-cascader"
								@change=""
							/>
						</el-form-item>

						<el-form-item label="请求协议" prop="proto">
							<el-radio-group v-model="inputInfo.proto">
								<el-radio label="http" />
							</el-radio-group>
						</el-form-item>
						<el-form-item label="请求方式" prop="queryMethod">
							<el-select style="width: 100%" v-model="inputInfo.queryMethod">
								<el-option v-for="item in ['get', 'post']" :key="item" :label="item" :value="item" />
							</el-select>
						</el-form-item>
						<el-form-item label="返回类型" prop="returnType">
							<el-select style="width: 100%" v-model="inputInfo.returnType">
								<el-option v-for="item in ['json', 'csv']" :key="item" :label="item" :value="item" />
							</el-select>
						</el-form-item>
						<el-form-item label="描述" prop="description">
							<el-input
								v-model="inputInfo.description"
								show-word-limit
								placeholder=""
								type="textarea"
								:rows="4"
								maxlength="500"
							/>
						</el-form-item>
					</el-form>
					<div class="flex-center mb10">
						<el-button type="primary" @click="testConfirm">test确定</el-button>
						<el-button type="primary" @click="nextStep">下一步</el-button>
					</div>
				</el-tab-pane>
				<el-tab-pane label="参数配置" :name="2">
					<paramsConfig v-show="paramsConfigRadio === 'config'"></paramsConfig>
					<paramsCode v-show="paramsConfigRadio === 'code'"></paramsCode>
					<div class="flex-center mb10" style="justify-content: flex-end !important; width: 100%; position: relative">
						<el-button type="primary" @click="preStep">上一步</el-button>
						<el-button type="primary" @click="nextStep" class="mr16">下一步</el-button>
					</div>
				</el-tab-pane>
				<el-tab-pane label="接口测试" :name="3">
					<testInterface></testInterface>
					<div class="flex-center mb10" style="justify-content: flex-end !important; width: 100%; position: relative">
						<el-button type="primary" @click="preStep">上一步</el-button>
						<el-button type="primary" class="mr16">创建API</el-button>
					</div>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup lang="ts">
import {} from "vue";
import paramsConfig from "./components/paramsConfig/index.vue";
import paramsCode from "./components/paramsCode/index.vue";
import testInterface from "./components/testInterface/index.vue";
import useOnePageHook from "./hooks/onePageHook";
import { ElMessage, type FormInstance, type FormRules, type TabsPaneContext } from "element-plus";
const activeName = ref(1);
const paramsConfigRadio = ref("code");
const preStep = () => {
	activeName.value--;
};
const nextStep = () => {
	activeName.value++;
};
const inputInfoRef = <any>ref(null);
const testConfirm = () => {
	let formEl = <FormInstance | undefined>inputInfoRef.value;
	if (!formEl) return;
	formEl.validate(async (valid, fields) => {
		if (valid) {
			console.log(inputInfo.value);
		} else {
			console.log("error", fields);
		}
	});
};
const inputInfo = ref({
	apiName: "",
	apiPath: "",
	apiCatalog: "",
	proto: "http",
	queryMethod: "get",
	returnType: "json",
	description: "",
});
const rulesForm = reactive<any>({
	apiName: [
		{ required: true, message: "API名称不能为空!", trigger: "blur" },
		{ min: 3, max: 30, message: "长度在 3 到 30 个字符", trigger: "blur" },
	],
	apiPath: [{ required: true, message: "API路径不能为空!", trigger: "change" }],
	apiCatalog: [{ required: true, message: "API目录不能为空!", trigger: "change" }],
	description: [{ required: true, message: "API描述不能为空!", trigger: "blur" }],
});

let { catalogOptions, pathOptions } = useOnePageHook();
</script>

<style lang="scss" scoped>
* {
	box-sizing: border-box;
}
.custom-cascader {
}
.api-config {
	flex: 1;
	height: 0;
	display: flex;
	flex-direction: column;
	width: 100%;
	background: #fff;
	border-radius: 10px;
	position: relative;
	.content-block {
		flex: 1;
		height: 0;
		display: flex;
		flex-direction: column;
		:deep(.el-tabs) {
			.el-tabs__header {
				display: none;
			}
			.el-tab-pane {
				align-items: center;
			}
		}
	}
}
</style>
